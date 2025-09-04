from datetime import datetime
from ...dbModels.order import Order




def generate_order_number(order_id: int) -> str:
    today = datetime.now().strftime("%y%m%d")  # напр. 250904 (год, месяц, день)
    return f"{today}-{order_id:04d}"  # 0001, 0002 и т.д.




def get_total_order_status_count():
    orders = Order.query.all()
    counts = dict(
        new = 0,
        confirmed = 0,
        preparing = 0,
        ready = 0,
        completed = 0,
        canceled = 0,
    )

    for order in orders:
        status = order.status.value
        counts[status] += 1
    
    return counts