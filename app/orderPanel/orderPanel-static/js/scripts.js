$('#clients-table').on('click', '.clients-table-client-row', function () {
	let tr = $(this);
	$('#clientSurname').val(tr.attr('surname'));
	$('#clientName').val(tr.attr('name'));
	$('#clientPhone').val(tr.attr('phone'));
	$('#clientAddlPhone').val(tr.attr('addl-phone'));
	$('#comment').val(tr.attr('comment'));
});




// $('#addl-price').on('input', function () {
// 	let price = clearSpace($('#price').val());
	
// 	let addlPrice = clearSpace($('#addl-price').val());
// 	addlPrice = addlPrice === '' ? 0 : addlPrice
	
// 	let discount = clearSpace($('#discount').val());
// 	discount = discount === '' ? 0 : discount
	
// 	let result = groupingNumbers(
// 		parseInt(price, 10) + parseInt(addlPrice, 10) + parseInt(discount, 10)
// 	)
	
// 	$('#final-price').val(result)
// });


$('#discount').on('input', function () {
	let price = clearSpace($('#price').val());
	price = price === '' ? 0 : price;
	
	// let addlPrice = clearSpace($('#addl-price').val());
	// addlPrice = addlPrice === '' ? 0 : addlPrice
	
	let discount = clearSpace($('#discount').val());
	discount = discount === '' ? 0 : discount
	
	let result = groupingNumbers(
		parseInt(price, 10) - parseInt(discount, 10) //  + parseInt(addlPrice, 10)
	)
	
	$('#final-price').val(result)
});


$('#payment').on('input', function () {
	let finalPrice = clearSpace($('#final-price').val());
	finalPrice = finalPrice === '' ? 0 : finalPrice;

	let payment = clearSpace($('#payment').val());
	payment = payment === '' ? 0 : payment;
	
	if (parseInt(finalPrice, 10) < parseInt(payment, 10)) {
		if (!hasClass($('#payment'), 'is-invalid')) {
			$('#payment').addClass('is-invalid');
		}
	} else {
		if (hasClass($('#payment'), 'is-invalid')) {
			$('#payment').removeClass('is-invalid');
		}
	}
});
