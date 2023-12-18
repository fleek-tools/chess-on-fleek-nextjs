import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { useBoardTheme } from "@/app/provider";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useBoardTheme();

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
      dark: { backgroundColor: "#7E7E7E" },
      light: { backgroundColor: "#ABABAB" },
      label: "Metal",
    },
  ];

  const changeTheme = (
    darkSquareStyle: React.CSSProperties,
    lightSquareStyle: React.CSSProperties
  ) => {
    setTheme({ darkSquareStyle, lightSquareStyle });
    onClose();
  };

  return (
    <>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onClose={onClose}
        className="bg-zinc-950"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Board Theme
              </ModalHeader>
              <ModalBody>
                <p>Choose a theme:</p>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((t, index) => (
                    <Tooltip
                      color="default"
                      key={index}
                      content={t.label}
                      className="bg-black text-white"
                    >
                      <Button
                        color="default"
                        style={{
                          width: "100%",
                          background: `linear-gradient(90deg, ${t.dark.backgroundColor} 50%, ${t.light.backgroundColor} 50%)`,
                        }}
                        onClick={() => changeTheme(t.dark, t.light)}
                      />
                    </Tooltip>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingsModal;