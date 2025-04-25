import React from 'react';
import { Button, Modal } from 'rsuite';
import { request } from '../../common/components/helpers/axios_helper';

const CategoryDeleteModal = ({pickCategory, modal_Close}) => {

      // 카테고리 삭제
      const deleteCategory = () => {
        request("DELETE", `/schedule/deleteCategory/${pickCategory}`)
          .then((res) => {
            if (res.status === 200) {
              if (res.data !== "") {
                alert(res.data); // 기본일정 삭제불가 메시지
              } else {
                window.location.reload(); // 새로고침
              }
            } else {
              alert("삭제 실패하였습니다");
            }
          })
          .catch((error) => {
            console.log("실패", error);
          });
      };

    return (
        <div>
            <Modal.Header style={{ width: "200px" }}>
                <Modal.Title>!주의!</Modal.Title>
            </Modal.Header>
            <Modal.Body>해당 카테고리를 삭제하면, 이 카테고리에 속한 모든 일정도 함께 삭제됩니다.</Modal.Body>
            <Modal.Footer>
                <Button onClick={deleteCategory} appearance="primary">
                    Ok
                </Button>
                <Button onClick={modal_Close} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </div>
    );
};

export default CategoryDeleteModal;