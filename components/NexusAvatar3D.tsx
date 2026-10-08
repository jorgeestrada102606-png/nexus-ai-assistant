'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Sparkles, Square, Play } from 'lucide-react';

interface NexusAvatar3DProps {
  isSpeaking: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onStopVoice: () => void;
  onTestVoice?: () => void;
}

export const NexusAvatar3D: React.FC<NexusAvatar3DProps> = ({
  isSpeaking,
  voiceEnabled,
  onToggleVoice,
  onStopVoice,
  onTestVoice,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef<boolean>(isSpeaking);

  // Keep ref synchronized with prop for the requestAnimationFrame loop
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Holographic Materials
    const cyanColor = 0x00f0ff;
    const coreBlueColor = 0x3b82f6;
    const brightWhite = 0xffffff;

    // Inner Glowing Core (Nucleus)
    const coreGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: coreBlueColor,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Solid Glow Center
    const innerCenterGeom = new THREE.SphereGeometry(0.38, 16, 16);
    const innerCenterMat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.9,
    });
    const innerCenter = new THREE.Mesh(innerCenterGeom, innerCenterMat);
    scene.add(innerCenter);

    // Orbital Ring 1 (Horizontal Arc)
    const ring1Geom = new THREE.TorusGeometry(1.2, 0.022, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    scene.add(ring1);

    // Orbital Ring 2 (Vertical Arc)
    const ring2Geom = new THREE.TorusGeometry(1.4, 0.018, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: coreBlueColor,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // Orbital Ring 3 (Outer Diagonal Arc)
    const ring3Geom = new THREE.TorusGeometry(1.65, 0.015, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.5,
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    scene.add(ring3);

    // Surrounding Particle Constellation
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1.6 + Math.random() * 0.7;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: cyanColor,
      size: 0.038,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = (x / width) * 0.5;
      mouseY = -(y / height) * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // CRITICAL REQUIREMENT:
      // "que se mueva cuando y solo cuando hable con voz"
      const speaking = isSpeakingRef.current;

      if (speaking) {
        time += 0.055;

        // Dynamic 3D motion while speaking
        const pulse = 1 + Math.sin(time * 6) * 0.12 + Math.cos(time * 9) * 0.05;
        coreMesh.scale.set(pulse, pulse, pulse);
        innerCenter.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);

        // Multi-axis rotation of gimbal rings
        ring1.rotation.z += 0.035;
        ring1.rotation.x += 0.015;

        ring2.rotation.y += 0.04;
        ring2.rotation.z += 0.02;

        ring3.rotation.x -= 0.025;
        ring3.rotation.y -= 0.03;

        // Revolving particle cloud
        particles.rotation.y += 0.02;
        particles.rotation.x += 0.01;

        // Color intensity while speaking
        coreMaterial.opacity = 0.95;
        innerCenterMat.opacity = 1.0;
        ring1Mat.opacity = 0.95;
      } else {
        // Dormant / Rest state: Completely static / minimal resting posture
        // As requested: Only moves when speaking!
        coreMesh.scale.set(1, 1, 1);
        innerCenter.scale.set(1, 1, 1);
        coreMaterial.opacity = 0.45;
        innerCenterMat.opacity = 0.6;
        ring1Mat.opacity = 0.4;
        ring2Mat.opacity = 0.3;
        ring3Mat.opacity = 0.25;
      }

      // Camera smoothly tracks subtle mouse perspective
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      ring3Geom.dispose();
      ring3Mat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0e1626]/90 to-[#090e17]/95 border border-cyan-500/25 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-md flex flex-col items-center select-none overflow-hidden group">
      {/* Subtle Arc-reactor background aura */}
      <div
        className={`absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl transition-opacity duration-500 pointer-events-none ${
          isSpeaking ? 'opacity-90 scale-125' : 'opacity-25'
        }`}
      />
      <div
        className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-600/15 blur-3xl transition-opacity duration-500 pointer-events-none ${
          isSpeaking ? 'opacity-90 scale-125' : 'opacity-25'
        }`}
      />

      {/* Top HUD Header */}
      <div className="w-full flex items-center justify-between z-10 pb-1 border-b border-cyan-500/15 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 relative">
            {isSpeaking && (
              <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
            )}
          </div>
          <span className="font-bold tracking-wider text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
            NEXUS // CORE 3D
          </span>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center gap-1.5">
          {isSpeaking ? (
            <div className="flex items-center gap-1 text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30">
              {/* Animated Equalizer bars */}
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-emerald-400 animate-bounce" />
                <span className="w-0.5 h-2/3 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-0.5 h-1/2 bg-emerald-400 animate-pulse" />
              </div>
              <span>VOCALIZANDO</span>
            </div>
          ) : (
            <span className="text-slate-400 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/40 border border-slate-700/40">
              EN REPOSO
            </span>
          )}
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-44 sm:h-48 my-1 flex items-center justify-center cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Bottom Controls Bar */}
      <div className="w-full z-10 flex items-center justify-between pt-2 border-t border-cyan-500/15">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
              voiceEnabled
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200'
            }`}
            title={voiceEnabled ? 'Voz activada automáticamente' : 'Voz silenciada'}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voz: Activa</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Voz: Mute</span>
              </>
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={onStopVoice}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs transition-all active:scale-95"
              title="Detener voz"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Detener</span>
            </button>
          )}
        </div>

        {onTestVoice && !isSpeaking && (
          <button
            onClick={onTestVoice}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/90 hover:text-cyan-300 hover:underline transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Probar voz</span>
          </button>
        )}
      </div>
    </div>
  );
};
