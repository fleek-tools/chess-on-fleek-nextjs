"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Avatar,
  Tooltip,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { useBoardStore } from "@/app/store";
import * as FlagIcons from "country-flag-icons/react/3x2";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// List of countries with their codes
const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "BR", name: "Brazil" },
  { code: "RU", name: "Russia" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  // Add more countries as needed
].sort((a, b) => a.name.localeCompare(b.name));

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const setTheme = useBoardStore((state) => state.setTheme);
  const { 
    userName, 
    profilePhoto, 
    nationality,
    setUserName, 
    setProfilePhoto,
    setNationality 
  } = useBoardStore((state) => ({
    userName: state.userName,
    profilePhoto: state.profilePhoto,
    nationality: state.nationality,
    setUserName: state.setUserName,
    setProfilePhoto: state.setProfilePhoto,
    setNationality: state.setNationality
  }));

  const themes = [
    {
      dark: { backgroundColor: "#779952" },
      light: { backgroundColor: "#edeed1" },
      label: "Green",
    },
    {
      dark: { backgroundColor: "#4879AD" },
      light: { backgroundColor: "#C3CDD7" },
      label: "Blue",
    },
    {
      dark: { backgroundColor: "#B58863" },
      light: { backgroundColor: "#F0D9B5" },
      label: "Wood",
    },
    {
      dark: { backgroundColor: "#71819B" },
      light: { backgroundColor: "#CCCFE0" },
      label: "Canvas",
    },
    {
      dark: { backgroundColor: "#8476BA" },
      light: { backgroundColor: "#F8F8F8" },
      label: "Purple",
    },
    {
      dark: { backgroundColor: "#84643F" },
      light: { backgroundColor: "#BFB7AE" },
      label: "Brown",
    },
  ];

  const changeTheme = (
    darkSquareStyle: React.CSSProperties,
    lightSquareStyle: React.CSSProperties
  ) => {
    setTheme({ darkSquareStyle, lightSquareStyle });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleNationalityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNationality(event.target.value);
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Game Settings
        </ModalHeader>
        <ModalBody>
          <p>User Information</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <label htmlFor="profile-photo" className="cursor-pointer">
                <Avatar size="lg" src={profilePhoto} />
                <Input
                  id="profile-photo"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div className="flex-1">
                <Input
                  label="User Name"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Nationality</label>
              <div className="flex gap-2 items-center">
                <select
                  value={nationality}
                  onChange={handleNationalityChange}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg flex-1"
                >
                  {countries.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className="w-8 h-6">
                  {nationality && FlagIcons[nationality as keyof typeof FlagIcons] && 
                    React.createElement(FlagIcons[nationality as keyof typeof FlagIcons], {
                      className: "w-full h-full"
                    })}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4">Board Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t, index) => (
              <Tooltip color="default" key={index} content={t.label}>
                <button
                  className="w-full h-12 rounded cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${t.dark.backgroundColor} 50%, ${t.light.backgroundColor} 50%)`,
                  }}
                  onClick={() => changeTheme(t.dark, t.light)}
                />
              </Tooltip>
            ))}
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
