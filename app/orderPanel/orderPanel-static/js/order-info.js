
$(document).on('click', '.order-status-btn', function (e) {
	e.preventDefault()

	let order_id = $(this).closest('.warehouse-product_info-product-name').attr('data-id');
	let status = $(this).attr('data-status');
	let data = {
		'id': order_id,
		'status': status,
	}
	socket.emit('server-update-order-status', data);
});



socket.on('client-update-order-status', function (data) {
	$('.order-status').text(data.status);
	$('.order-update-datetime').text(data.update_datetime);
});