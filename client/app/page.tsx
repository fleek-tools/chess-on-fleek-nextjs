"use client";
import { Button, useDisclosure } from "@nextui-org/react";
import { GameSelectionModal, LeaderboardUI } from "@/components";
import { useState } from "react";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGameMode, setSelectedGameMode] = useState("");

  const openModal = (gameMode: string) => {
    setSelectedGameMode(gameMode);
    onOpen();
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Title and Button */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-black text-gray-100 text-3xl">Knightly</h1>
          <Button
            color="success"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              openModal("computer");
            }}
          >
            Against Computer
          </Button>
        </div>

        {/* Leaderboard */}
        <LeaderboardUI />

        {/* Modal */}
        <GameSelectionModal
          isOpen={isOpen}
          onClose={onClose}
          selectedGameMode={selectedGameMode}
        />
      </div>
    </main>
  );
}
