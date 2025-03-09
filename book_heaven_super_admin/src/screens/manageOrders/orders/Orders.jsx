import React, { useState, useEffect } from "react";
import "./Orders.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  setOrders,
  updateOrderStatus,
} from "../../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../../utils/customLoader/Loader";
import InputField from "../../../utils/customInputField/InputField";
import Modal from "../../../utils/customModal/Modal";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.orders.orders);

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      dispatch(getAllOrders())
        .unwrap()
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, user?.id]);

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter((order) =>
    order.status?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleViewDetail = (order) => {
    navigate(`/admin/orders/order-details/${order._id}`, {
      state: { order },
    });
  };

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const changeOrderStatus = async (status) => {
    setLoadingAction(status);
    try {
      if (selectedOrder?._id) {
        await dispatch(
          updateOrderStatus({
            orderId: selectedOrder._id,
            status: status,
          })
        ).unwrap();

        toast.success(
          `Status changed to ${status.toLowerCase()} successfully!`
        );

        // Update local state
        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id ? { ...order, status } : order
        );
        dispatch(setOrders(updatedOrders));
      }
    } catch (error) {
      toast.error(`Failed to change status: ${error.message}`);
    } finally {
      setLoadingAction(null);
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <section id="order">
      <div className="orders-container">
        <h2 className="orders-title">Orders List</h2>
        <div className="search-container" style={{ marginBottom: 15 }}>
          <div className="container text-center">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <InputField
                  type="text"
                  placeholder="Search Orders"
                  value={search}
                  onChange={handleSearch}
                  width={300}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">
                      #{order._id.substring(18, 24).toUpperCase()}
                    </td>
                    <td className="order-customer">
                      {order.userId?.userName || "N/A"}
                    </td>
                    <td className="order-status">
                      <span
                        className={`status-badge ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-button view-detail"
                        onClick={() => handleViewDetail(order)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      <button
                        className="action-button status-change"
                        onClick={() => handleStatusChange(order)}
                      >
                        <i className="fas fa-sync"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders-found">No Orders Found</div>
        )}
      </div>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Change Status for #${
          selectedOrder?._id?.substring(18, 24).toUpperCase() || "Order"
        }`}
        loading={loadingAction !== null}
        buttons={["PROCESSING", "SHIPPED", "DELIVERED"].map((status) => ({
          label: status.charAt(0) + status.slice(1).toLowerCase(),
          className: `modal-btn-${status.toLowerCase()}`,
          onClick: () => changeOrderStatus(status),
          loading: loadingAction === status,
        }))}
      >
        Are you sure you want to change the status of this order?
      </Modal>
    </section>
  );
};

export default Orders;
