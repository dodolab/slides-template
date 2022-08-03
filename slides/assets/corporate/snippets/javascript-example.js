// this is redux saga example
const fetchItemsSaga = function* () {
    while (true) {
@fragment highlight-current-red
        yield take(FETCH_CUSTOMERS_START)
@fragment highlight-current-red
        yield take(FETCH_ORDERS_START)

        const customers = yield call(fetchCustomers)
        const orders = yield call(fetchOrders)
@fragment highlight-current-red
        yield put(customersFetchComplete(customers))
@fragment highlight-current-red
        yield put(ordersFetchComplete(orders))
    }
}