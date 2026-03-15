'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';
import type { ThemeProps } from '../types';

export function ContactCard({ data }: ThemeProps) {
  const { contact } = data;
  
  if (!Object.values(contact).some(Boolean)) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="col-span-1 border border-neutral-800/50 bg-[#111] rounded-2xl p-6 relative group overflow-hidden flex flex-col justify-center"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

      <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">
        Contact
      </h3>

      <div className="flex flex-col gap-3">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 text-neutral-300 hover:text-white hover:translate-x-1 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium truncate">{contact.email}</span>
          </a>
        )}

        {contact.phone && (
          <div className="flex items-center gap-3 text-neutral-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium truncate">{contact.phone}</span>
          </div>
        )}

        {contact.location && (
          <div className="flex items-center gap-3 text-neutral-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium truncate">{contact.location}</span>
          </div>
        )}

        {contact.linkedin && (
          <a
            href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-neutral-300 hover:text-[#0a66c2] hover:translate-x-1 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400 group-hover/linkedin:text-[#0a66c2]">
              <Linkedin className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium truncate">LinkedIn</span>
          </a>
        )}

        {contact.github && (
          <a
            href={contact.github.startsWith('http') ? contact.github : `https://${contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-neutral-300 hover:text-white hover:translate-x-1 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400">
              <Github className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium truncate">GitHub</span>
          </a>
        )}

        {contact.portfolio && (
          <a
            href={contact.portfolio.startsWith('http') ? contact.portfolio : `https://${contact.portfolio}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-neutral-300 hover:text-blue-400 hover:translate-x-1 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium truncate">Portfolio</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
