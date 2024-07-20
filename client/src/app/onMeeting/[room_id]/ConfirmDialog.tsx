import { Button, Modal } from 'flowbite-react'
import React, { Dispatch, SetStateAction } from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}


export default function ConfirmDialog({openModal, setOpenModal}:Props) {
    const handleOffMeeting = () => {
        setOpenModal(false)
        window.close();
    };
  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
    <Modal.Header />
    <Modal.Body>
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Bạn có chắc chắn muốn rời phòng họp không
            </h3>
            <div className="flex justify-center gap-4">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Hủy
                </Button>
                <Button color="failure" onClick={handleOffMeeting}>
                    Rời khỏi
                </Button>
            </div>
        </div>
    </Modal.Body>
    </Modal>
  )
}
