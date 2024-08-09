import { Button, Modal } from 'flowbite-react'
import React, { Dispatch, SetStateAction } from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    onClick:()=>void;
    isLoading: boolean;
    type: "confirm" | "delete"
}

const ModalRoom = ({openModal, setOpenModal, onClick, isLoading, type}:Props) => {
    const onClickEvent = () =>{
        onClick();

    }
  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
    <Modal.Header />
    <Modal.Body>
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {type === "delete" ? "Bạn có chắc chắn muốn xóa phòng họp không" : "Bạn có chắc chắn lưu không ?" }
            </h3>
            <div className="flex justify-center gap-4">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Hủy
                </Button>
                <Button isProcessing={isLoading} color={type === "delete" ? "failure" : "success"} onClick={onClickEvent}>
                    {type === "delete" ? "Xóa" : "Đồng ý"}
                </Button>
            </div>
        </div>
    </Modal.Body>
    </Modal>
  )
}

export default ModalRoom