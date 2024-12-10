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
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="font-black text-gray-100 text-3xl">Knightly</h1>
          <div className="flex justify-center items-center gap-4">
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
        </div>
        
        <div className="w-full md:w-auto">
          <LeaderboardUI />
        </div>
      </div>

      <GameSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        selectedGameMode={selectedGameMode}
      />
    </main>
  );
}
