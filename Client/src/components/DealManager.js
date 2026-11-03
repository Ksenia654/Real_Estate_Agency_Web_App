import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DealDocumentUpload from "./DealDocumentUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function withLocation(Component) {
    return function Wrapper(props) {
        const location = useLocation();
        return <Component {...props} location={location} />;
    };
}

class DealManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            deals: [],
            selectedRequest: null,
            dealStatus: "draft",
            loading: false,
            error: null,
            processStep: null,
            progress: 0
        };
    }

    async componentDidMount() {
        try {
            const reqRes = await axios.get("http://localhost:5000/api/requests");
            const requests = reqRes.data;

            const dealRes = await axios.get("http://localhost:5000/api/deals");
            const deals = dealRes.data;

            this.setState({ requests, deals });

            const params = new URLSearchParams(this.props.location.search);
            const requestId = params.get("requestId");

            if (requestId) {
                const found = requests.find((r) => r._id === requestId);
                if (found) {
                    this.setState({ selectedRequest: found });
                }
            }
        } catch (err) {
            console.error("Ошибка загрузки данных", err);
            this.setState({ error: "Не удалось загрузить заявки/сделки" });
        }
    }

    createDeal = async (request) => {
        this.setState({ loading: true, error: null });
        try {
            const res = await axios.post("http://localhost:5000/api/deals", {
                requestId: request._id,
                propertyId: request.propertyId._id || request.propertyId,
                clientId: request.userId._id || request.userId,
                status: "draft"
            });

            this.props.onDealManage?.(res.data);

            this.setState((prev) => ({
                deals: [...prev.deals, res.data],
                selectedRequest: request,
                dealStatus: "draft",
                loading: false
            }));
        } catch (err) {
            console.error("Ошибка создания сделки", err);
            this.setState({ error: "Не удалось создать сделку", loading: false });
        }
    };

    handleContract = async (deal) => {
        try {
            await axios.patch(`http://localhost:5000/api/deals/${deal._id}`, { status: "signed" });

            this.props.onContract?.({
                requestId: deal.requestId._id || deal.requestId,
                status: "signed"
            });

            this.setState(prev => ({
                deals: prev.deals.map(d =>
                    d._id === deal._id ? { ...d, status: "signed" } : d
                ),
                dealStatus: "signed",
                processStep: "Подписание завершено. Запуск проверки документов...",
                progress: 25
            }));

            this.processDealChain(deal._id);

        } catch (err) {
            console.error("Ошибка подписания договора:", err);
            this.setState({ error: "Не удалось подписать договор" });
        }
    };

    processDealChain(dealId) {
        this.checkDocuments(dealId)
            .then(() => {
                this.setState({ processStep: "Документы проверены. Регистрация сделки...", progress: 50 });
                return this.registerDeal(dealId);
            })
            .then(() => {
                this.setState({ processStep: "Сделка зарегистрирована. Расчёт комиссии...", progress: 75 });
                return this.calculateCommission(dealId);
            })
            .then((final) => {
                this.setState(prev => ({
                    deals: prev.deals.map(d =>
                        d._id === dealId ? { ...d, status: "registered", commission: final.commission } : d
                    ),
                    processStep: `Процесс завершён. Комиссия: ${final.commission}`,
                    progress: 100
                }));

                this.remindCommissionPayment(dealId, final.commission);
            })
            .catch(err => {
                console.error("Ошибка в цепочке:", err);
                this.setState({ error: "Не удалось завершить процесс сделки", processStep: null, progress: 0 });
            });
    }

    checkDocuments(dealId) {
        return new Promise((resolve) => {
            console.log("Проверка документов...");
            this.setState({ processStep: "Проверка документов...", progress: 25 });

            // 👉 вызов callback из AdminDeals
            this.props.onDocumentUpload?.({ dealId, status: "checked" });

            setTimeout(() => resolve(true), 1000);
        });
    }

    registerDeal(dealId) {
        return axios.patch(`http://localhost:5000/api/deals/${dealId}`, { status: "registered" });
    }

    calculateCommission(dealId) {
        return new Promise((resolve) => {
            console.log("Расчёт комиссии...");
            setTimeout(() => resolve({ commission: 500 }), 1000);
        });
    }

    remindCommissionPayment(dealId, commission) {
        setTimeout(() => {
            console.log(`Напоминание: сделка ${dealId}, комиссия ${commission} должна быть оплачена!`);
            this.setState({ processStep: `Напоминание: оплатите комиссию ${commission}!` });
            toast.info(`Напоминание: оплатите комиссию ${commission}!`, {
                position: "top-right",
                autoClose: 5000
            });
        }, 3000);
    }

    render() {
        const { deals, selectedRequest, dealStatus, loading, error, processStep, progress } = this.state;

        return (
            <div style={{ marginTop: "20px" }}>
                <h2>Управление сделками</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {loading && <p>Загрузка...</p>}
                {processStep && <p style={{ color: "blue" }}>{processStep}</p>}

                {/* прогресс бар */}
                {progress > 0 && (
                    <div style={{ width: "100%", background: "#eee", margin: "10px 0" }}>
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "10px",
                                background: progress === 100 ? "green" : "blue",
                                transition: "width 0.5s"
                            }}
                        />
                    </div>
                )}

                <h3>Список сделок</h3>
                <ul>
                    {deals.length === 0 ? (
                        <p>Сделок пока нет</p>
                    ) : (
                        deals.map((deal) => (
                            <li key={deal._id} style={{ marginBottom: 8 }}>
                                Сделка #{deal._id} |{" "}
                                Объект: {typeof deal.propertyId === "object" ? deal.propertyId.title : deal.propertyId} |{" "}
                                Клиент: {typeof deal.clientId === "object" ? deal.clientId.username : deal.clientId} |{" "}
                                Статус: {deal.status}
                            </li>
                        ))
                    )}
                </ul>

                {}
                {selectedRequest && (
                    <div style={{ marginTop: "16px", padding: "8px 0", borderTop: "1px solid #ddd" }}>
                        <h3>Сделка по заявке {selectedRequest._id}</h3>
                        <p>Текущий статус: {dealStatus}</p>

                        {(() => {
                            const currentDeal = deals.find(
                                d => d.requestId === selectedRequest._id || d.requestId?._id === selectedRequest._id
                            );

                            if (!currentDeal) {
                                return <p>Сделка для этой заявки пока не создана</p>;
                            }

                            return (
                                <>
                                    <button onClick={() => this.handleContract(currentDeal)}>
                                        Подписать договор
                                    </button>

                                    <h4 style={{ marginTop: 12 }}>Загрузка документов:</h4>
                                    <DealDocumentUpload
                                        dealId={currentDeal._id}
                                        onUploaded={(doc) => {
                                            this.setState(prev => ({
                                                deals: prev.deals.map(d =>
                                                    d._id === currentDeal._id
                                                        ? { ...d, documents: [...(d.documents || []), doc] }
                                                        : d
                                                )
                                            }));
                                        }}
                                    />

                                    <h4 style={{ marginTop: 12 }}>Документы:</h4>
                                    {Array.isArray(currentDeal.documents) && currentDeal.documents.length > 0 ? (
                                        <ul>
                                            {currentDeal.documents.map((doc) => (
                                                <li key={doc.url}>

                                                <a href={`http://localhost:5000${doc.url}`} target="_blank" rel="noreferrer">
                                                        {doc.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Документов пока нет</p>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        );
    }
}

export default withLocation(DealManager);






