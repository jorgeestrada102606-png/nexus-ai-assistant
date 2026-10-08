'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Square, Play } from 'lucide-react';

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

    // 2. Bioluminescent Mint / Emerald Theme Colors
    const mintColor = 0x00F5A0;
    const emeraldColor = 0x05DF72;
    const tealColor = 0x10B981;

    // Inner Glowing Core (Nucleus)
    const coreGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: emeraldColor,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Solid Glow Center
    const innerCenterGeom = new THREE.SphereGeometry(0.38, 16, 16);
    const innerCenterMat = new THREE.MeshBasicMaterial({
      color: mintColor,
      transparent: true,
      opacity: 0.9,
    });
    const innerCenter = new THREE.Mesh(innerCenterGeom, innerCenterMat);
    scene.add(innerCenter);

    // Orbital Ring 1
    const ring1Geom = new THREE.TorusGeometry(1.2, 0.022, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: mintColor,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    scene.add(ring1);

    // Orbital Ring 2
    const ring2Geom = new THREE.TorusGeometry(1.4, 0.018, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: tealColor,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // Orbital Ring 3
    const ring3Geom = new THREE.TorusGeometry(1.65, 0.015, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x34D399,
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
      color: mintColor,
      size: 0.038,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse tilt interaction
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

      // ONLY moves when speaking!
      const speaking = isSpeakingRef.current;

      if (speaking) {
        time += 0.055;

        const pulse = 1 + Math.sin(time * 6) * 0.12 + Math.cos(time * 9) * 0.05;
        coreMesh.scale.set(pulse, pulse, pulse);
        innerCenter.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);

        ring1.rotation.z += 0.035;
        ring1.rotation.x += 0.015;

        ring2.rotation.y += 0.04;
        ring2.rotation.z += 0.02;

        ring3.rotation.x -= 0.025;
        ring3.rotation.y -= 0.03;

        particles.rotation.y += 0.02;
        particles.rotation.x += 0.01;

        coreMaterial.opacity = 0.95;
        innerCenterMat.opacity = 1.0;
        ring1Mat.opacity = 0.95;
      } else {
        // Dormant / resting state
        coreMesh.scale.set(1, 1, 1);
        innerCenter.scale.set(1, 1, 1);
        coreMaterial.opacity = 0.45;
        innerCenterMat.opacity = 0.6;
        ring1Mat.opacity = 0.4;
        ring2Mat.opacity = 0.3;
        ring3Mat.opacity = 0.25;
      }

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
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1E16]/90 to-[#07130D]/95 border border-[#00F5A0]/25 p-4 shadow-xl shadow-emerald-950/30 backdrop-blur-md flex flex-col items-center select-none overflow-hidden group">
      {/* Bioluminescent aura background */}
      <div
        className={`absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#00F5A0]/15 blur-3xl transition-opacity duration-500 pointer-events-none ${
          isSpeaking ? 'opacity-90 scale-125' : 'opacity-25'
        }`}
      />
      <div
        className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#05DF72]/15 blur-3xl transition-opacity duration-500 pointer-events-none ${
          isSpeaking ? 'opacity-90 scale-125' : 'opacity-25'
        }`}
      />

      {/* Top HUD Header */}
      <div className="w-full flex items-center justify-between z-10 pb-1 border-b border-[#00F5A0]/15 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00F5A0] relative">
            {isSpeaking && (
              <span className="absolute inset-0 rounded-full bg-[#00F5A0] animate-ping opacity-75" />
            )}
          </div>
          <span className="font-bold tracking-wider text-[#00F5A0] drop-shadow-[0_0_8px_rgba(0,245,160,0.5)]">
            NEXUS // CORE 3D
          </span>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center gap-1.5">
          {isSpeaking ? (
            <div className="flex items-center gap-1.5 text-[#00F5A0] font-semibold px-2.5 py-0.5 rounded-full bg-[#082216] border border-[#00F5A0]/40">
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-[#00F5A0] animate-bounce" />
                <span className="w-0.5 h-2/3 bg-[#00F5A0] animate-pulse" />
                <span className="w-0.5 h-full bg-[#00F5A0] animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-0.5 h-1/2 bg-[#00F5A0] animate-pulse" />
              </div>
              <span>HABLANDO</span>
            </div>
          ) : (
            <span className="text-slate-400 text-[10px] px-2 py-0.5 rounded-full bg-[#0A1711] border border-white/5">
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
      <div className="w-full z-10 flex items-center justify-between pt-2 border-t border-[#00F5A0]/15">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
              voiceEnabled
                ? 'bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/40 hover:bg-[#00F5A0]/25'
                : 'bg-[#0E1A14] text-slate-400 border border-white/5 hover:text-slate-200'
            }`}
            title={voiceEnabled ? 'Voz activada' : 'Voz silenciada'}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00F5A0]" />
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
            className="flex items-center gap-1 text-[11px] font-mono text-[#00F5A0] hover:text-[#5EFAC5] hover:underline transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Probar voz</span>
          </button>
        )}
      </div>
    </div>
  );
};
