"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Screen-space sphere: solve for z on a disc, shade the implied normal.
// Cheaper than raymarching and indistinguishable at this size.
const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform float u_pulse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float R = 0.33 + u_pulse * 0.012;
  float d = length(uv);

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  // outer bloom
  float glow = exp(-max(d - R, 0.0) * 8.0);
  col += vec3(1.0, 0.62, 0.06) * glow * 0.45;
  alpha += glow * 0.42;

  if (d < R) {
    float z = sqrt(max(R * R - d * d, 0.0));
    vec3 n = normalize(vec3(uv, z));

    // molten surface drifting over the sphere
    vec2 sp = n.xy * 2.1 + vec2(u_time * 0.05, u_time * 0.032);
    float f = fbm(sp * 2.3);

    vec3 lightDir = normalize(vec3(-0.42, 0.58, 0.78));
    float diff = max(dot(n, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, n), vec3(0.0, 0.0, 1.0)), 0.0), 30.0);
    float fres = pow(1.0 - max(n.z, 0.0), 2.5);

    vec3 deep = vec3(0.26, 0.075, 0.005);
    vec3 mid  = vec3(1.0, 0.53, 0.02);
    vec3 hot  = vec3(1.0, 0.86, 0.52);

    vec3 base = mix(deep, mid, smoothstep(0.10, 0.88, diff * 0.82 + f * 0.5));
    base = mix(base, hot, spec * 0.9);
    base += vec3(1.0, 0.30, 0.12) * fres * 0.6;

    float edge = smoothstep(R, R - 0.005, d);
    col = mix(col, base, edge);
    alpha = max(alpha, edge);
  }

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/**
 * Amber molten orb rendered with a single fragment shader.
 *
 * No Three.js — the whole thing is one fullscreen triangle, so it adds no
 * dependency and costs a few hundred bytes of GLSL. Falls back to a CSS
 * gradient sphere when WebGL is unavailable or motion is reduced.
 */
export default function WebGLOrb({ size = 260, className = "" }) {
  const canvasRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl", { alpha: true });

    if (!gl) {
      // Signal the CSS fallback and bail.
      if (fallbackRef.current) fallbackRef.current.style.display = "block";
      canvas.style.display = "none";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (fallbackRef.current) fallbackRef.current.style.display = "block";
      canvas.style.display = "none";
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (fallbackRef.current) fallbackRef.current.style.display = "block";
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);

    // One oversized triangle covers the viewport with no index buffer.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uPulse = gl.getUniformLocation(prog, "u_pulse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);

    let raf = 0;
    const start = performance.now();

    function draw(now) {
      const t = (now - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform1f(uPulse, Math.sin(t * 1.1));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    }

    if (reduced) {
      // Draw a single static frame.
      gl.uniform1f(uTime, 0);
      gl.uniform1f(uPulse, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(draw);
    }

    function onVisibility() {
      if (reduced) return;
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [size]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: size, height: size, display: "block" }}
      />
      <div
        ref={fallbackRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "absolute",
          inset: "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, #FFD98A, #FFB000 35%, #8A4A05 70%, #2A1405 100%)",
          boxShadow: "0 0 60px rgba(255,176,0,0.35)",
        }}
      />
    </div>
  );
}
