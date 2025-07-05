"use client";

import { Hub } from "@/app/(preview)/actions";
import { GuageIcon, LightningIcon, LockIcon } from "./icons";
import { motion } from "framer-motion";
import { scaleLinear } from "d3-scale";

export const HubView = ({ hub }: { hub: Hub }) => {
  const countToHeight = scaleLinear()
    .domain([0, hub.lights.length])
    .range([0, 32]); // height in px

  return (
    <div className="flex flex-wrap gap-3 md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6">
      {/* Climate Card */}
      <motion.div
        className="bg-white shadow-md p-3 rounded-xl flex gap-3 items-center w-full sm:w-fit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-2 bg-blue-500 text-white rounded-lg">
          <GuageIcon />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-700">Climate</div>
          <div className="text-xs text-zinc-500">
            {`${hub.climate.low}°C - ${hub.climate.high}°C`}
          </div>
        </div>
      </motion.div>

      {/* Lights Card */}
      <motion.div
        className="bg-white shadow-md p-3 rounded-xl flex gap-3 items-center w-full sm:w-fit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative w-8 h-8 rounded-lg bg-zinc-300 flex items-center justify-center text-white">
          <LightningIcon className="z-10" />
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-amber-500 rounded-b-md"
            initial={{ height: 0 }}
            animate={{
              height: countToHeight(hub.lights.filter((l) => l.status).length),
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ zIndex: 5 }}
          />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-700">Lights</div>
          <div className="text-xs text-zinc-500">
            {`${hub.lights.filter((l) => l.status).length}/${hub.lights.length} On`}
          </div>
        </div>
      </motion.div>

      {/* Security Card */}
      <motion.div
        className="bg-white shadow-md p-3 rounded-xl flex gap-3 items-center w-full sm:w-fit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-2 bg-green-600 rounded-lg">
          <LockIcon />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-700">Security</div>
          <div className="text-xs text-zinc-500">
            {`${hub.locks.filter((l) => l.isLocked).length}/${hub.locks.length} Locked`}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
