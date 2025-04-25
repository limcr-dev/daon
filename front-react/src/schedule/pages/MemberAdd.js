import React, { useState } from 'react';
import { Button, Modal } from 'rsuite';
import Scroll from './Scroll';
import Treea from '../../orgChart/pages/Treea';
import MemberList from '../components/MemberList';

const MemberAdd = ({ open, onClose, pickMember, setPickMember}) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "right",
                    paddingLeft: "350px",
                    pointerEvents: "none"
                }}
                dialogClassName="modal-300w"
            >
                <div style={{ pointerEvents: "auto", width:"200px" }}>
                    <Modal.Header closeButton>
                        <Modal.Title>참석자 추가</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <MemberList pickMember={pickMember} setPickMember={setPickMember} />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={onClose}>
                            확인
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default MemberAdd;