import React from 'react';
import { ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '../design/modaldesign';

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>Confirm Submission</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Okay</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;