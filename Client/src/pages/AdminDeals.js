import React from "react";
import DealManager from "../components/DealManager";
import axios from "axios";

function AdminDeals() {
    const handleDealManage = (dealData) => {
        console.log("Управление сделкой:", dealData);
    };

    const handleDocumentUpload = async (docData) => {
        console.log("Документы загружены:", docData);
        try {
            await axios.post("http://localhost:5000/api/deal-documents", docData);
        } catch (err) {
            console.error("Ошибка сохранения документов", err);
        }
    };

    const handleContract = async (contractData) => {
        console.log("Договор подписан:", contractData);
        try {
            await axios.patch(`http://localhost:5000/api/deals/${contractData.requestId}`, {
                status: contractData.status
            });
        } catch (err) {
            console.error("Ошибка обновления статуса сделки", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Сделки</h2>
            <DealManager
                onDealManage={handleDealManage}
                onDocumentUpload={handleDocumentUpload}
                onContract={handleContract}
            />
        </div>
    );
}

export default AdminDeals;
