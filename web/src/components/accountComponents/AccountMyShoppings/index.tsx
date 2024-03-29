import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import api from "../../../services/api";
import PaginationNav from "../../PaginationNav";
import LoadingModal from "../../LoadingModal";
import { IProduct } from "../../../pages/product/[productId]";
import { IAddress } from "../../../contexts/userContext";

import { Container } from "./styles";

interface IOrderProduct extends IProduct {
  orders_products: {
    quantity_buyed: number;
    product_price: string;
    product_discount_percent: string;
  };
}

export interface IOrder {
  id: number;
  freight_name: string;
  freight_price: string;
  total_price: string;
  payment_method: string;
  status:
    | "select_payment_method"
    | "processing"
    | "waiting_payment"
    | "paid"
    | "dispatch"
    | "sent"
    | "received"
    | "refused";
  boleto_url: string | null;
  tracking_code: string | null;
  createdAt: string;
  address: IAddress;
  products: IOrderProduct[];
}

export default function AccountMyShoppings() {
  const [getOpenOrderTab, setOpenOrderTab] = useState<number[]>([]);

  const [getOrders, setOrders] = useState<IOrder[]>([]);
  const [getIsFetching, setIsFetching] = useState(false);

  const [getTotalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  const currentPage = Number(router.query.page) || 1;
  const _itemsPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, [router.query.page]);

  async function fetchOrders() {
    const offset = (currentPage - 1) * _itemsPerPage;
    const page = `?limit=${_itemsPerPage}&offset=${offset}`;

    try {
      setIsFetching(true);
      const response = await api.get(`/orders${page}`);

      setTotalPages(Math.ceil(response.data.count / _itemsPerPage));
      setOrders(response.data.orders);
      setIsFetching(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar ordens de compra");
      setIsFetching(false);
    }
  }

  function handleOpenTab(id: number) {
    if (getOpenOrderTab.includes(id)) {
      const openOrders = getOpenOrderTab.filter((orderId) => orderId != id);

      setOpenOrderTab(openOrders);
    } else {
      const openTabs = [...getOpenOrderTab];
      openTabs.push(id);

      setOpenOrderTab(openTabs);
    }
  }

  function handlePagination(page: number) {
    router.push({
      pathname: "/account",
      query: {
        ...router.query,
        page,
      },
    });
  }

  function handleProductAnchorClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    event.preventDefault();

    const href = event.currentTarget.getAttribute("href");

    router.push(href);
  }

  function handleSelectPayAnchor(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    orderId: number
  ) {
    event.stopPropagation();

    event.preventDefault();

    router.push(`/order/${orderId}/payment`);
  }

  return (
    <>
      <Container data-testid="my-shopping-component">
        {getIsFetching && <LoadingModal spinnerSize="10rem" />}

        <h1>Minhas compras</h1>

        {getOrders.map((order) => (
          <div
            key={order.id}
            className="order-card-container"
            data-testid="order-card-container"
          >
            <div className="card">
              <button
                type="button"
                className={`${
                  getOpenOrderTab.includes(order.id) ? "tab-open" : ""
                }`}
                onClick={() => handleOpenTab(order.id)}
                data-testid="order-card-button"
              >
                <div className="card-header">
                  <span>nº {("000000" + order.id).slice(-6)}</span>
                  <span>
                    Data:{" "}
                    {Intl.DateTimeFormat("pt-BR").format(
                      new Date(order.createdAt)
                    )}
                  </span>
                  <span>
                    Total: R${" "}
                    {(
                      Number(order.total_price) + Number(order.freight_price)
                    ).toFixed(2)}
                  </span>

                  {order.status == "select_payment_method" && (
                    <a
                      href={`/order/${order.id}/payment`}
                      className="pay-link"
                      title={"Pagar"}
                      onClick={(event) =>
                        handleSelectPayAnchor(event, order.id)
                      }
                    >
                      <span>Pagar</span>
                    </a>
                  )}

                  {order.status == "processing" && (
                    <span className="processing">Processando</span>
                  )}
                  {order.status == "waiting_payment" && (
                    <a
                      href={order.boleto_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${order.boleto_url ? "boleto-link" : ""}`}
                      title={order.boleto_url ? "Abrir boleto" : ""}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <span>Aguardando pagamento</span>
                    </a>
                  )}
                  {order.status == "paid" && (
                    <span className="paid">Pagamento aceito</span>
                  )}
                  {order.status == "dispatch" && (
                    <span className="dispatch">expedição</span>
                  )}
                  {order.status == "sent" && (
                    <span
                      className="tracking-code"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigator.clipboard.writeText(`${order.tracking_code}`);
                      }}
                    >
                      Cod. Rast.:&nbsp;
                      <span className="user-select">{order.tracking_code}</span>
                    </span>
                  )}
                  {order.status == "refused" && (
                    <span className="refused">Pagamento recusado</span>
                  )}
                </div>
              </button>

              {getOpenOrderTab.includes(order.id) && (
                <div className="order-content" data-testid="order-content">
                  <div className="freight-card">
                    <span></span>
                    <span>Frete: {order.freight_name.toUpperCase()}</span>
                    <span>R$ {Number(order.freight_price).toFixed(2)}</span>
                  </div>

                  {order.products.map((product) => {
                    const product_price = Number(
                      product.orders_products.product_price
                    );
                    const product_discount_percent = Number(
                      product.orders_products.product_discount_percent
                    );

                    const finalPrice = (
                      product_price -
                      product_price * (product_discount_percent / 100)
                    ).toFixed(2);

                    return (
                      <a
                        key={product.id}
                        className="order-card-details"
                        data-testid="order-card-details"
                        onClick={handleProductAnchorClick}
                        href={`/product/${product.id}?title=${String(
                          product.title
                        )
                          .split(" ")
                          .join("-")}`}
                      >
                        <div className="img-container">
                          <img
                            src={`${
                              product.images.length > 0
                                ? `${process.env.BACKEND_URL}/uploads/${product.images[0].filename}`
                                : "/images/img-n-disp.png"
                            }`}
                            alt={"imagem-" + product.title.split(" ").join("-")}
                          />
                        </div>
                        <span className="product-title">
                          <span>{product.title}</span>
                          <span>
                            {Number(
                              product.orders_products.product_discount_percent
                            ) > 0 && (
                              <span className="product-discount">
                                {
                                  product.orders_products
                                    .product_discount_percent
                                }
                                %
                              </span>
                            )}
                          </span>
                        </span>
                        <span>{product.orders_products.quantity_buyed}</span>
                        <span>
                          R${" "}
                          {(
                            Number(finalPrice) *
                            product.orders_products.quantity_buyed
                          ).toFixed(2)}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {getTotalPages > 1 && (
          <PaginationNav
            currentPage={currentPage}
            totalPages={getTotalPages}
            limitPageNav={5}
            handlePagination={handlePagination}
          />
        )}
      </Container>
    </>
  );
}
