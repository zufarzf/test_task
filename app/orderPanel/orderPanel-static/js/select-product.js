let smallScreenFormActive = 0;


const selectProductTemplate = (d) => {
	return `
		<div class="card selected-product" selected-product-id="${ d.id }">
			<div class="card-body">

				<div class="card-title-wrapper">
					<h5 class="card-title">${ d.name }</h5>
					
					<div class="dots-btn-wrapper">
						<a href="#" class="dots-btn">
							<svg width="5" height="19" viewBox="0 0 5 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="5" height="5" rx="2.5" fill="#4A5A6B"/>
								<rect y="7" width="5" height="5" rx="2.5" fill="#4A5A6B"/>
								<rect y="14" width="5" height="5" rx="2.5" fill="#4A5A6B"/>
							</svg>
						</a>

						<div class="dropdown-menu dropdown-menu-end dots-btn-dropdown" data-popper-placement="bottom-end" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(-15px, 0px);">

							<!-- item-->
							<a href="#" class="dropdown-item remove-select-product">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2 4H3.33333H14" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M12.6667 3.99992V13.3333C12.6667 13.6869 12.5262 14.026 12.2761 14.2761C12.0261 14.5261 11.687 14.6666 11.3333 14.6666H4.66667C4.31304 14.6666 3.9739 14.5261 3.72386 14.2761C3.47381 14.026 3.33333 13.6869 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 2.31296 5.47381 1.97382 5.72386 1.72378C5.97391 1.47373 6.31304 1.33325 6.66667 1.33325H9.33333C9.68695 1.33325 10.0261 1.47373 10.2761 1.72378C10.5262 1.97382 10.6667 2.31296 10.6667 2.66659V3.99992" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M6.66667 7.33325V11.3333" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M9.33333 7.33325V11.3333" stroke="#4A5A6B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<span> Убрать </span>
							</a>

						</div>
					</div>
				</div>
				
				<div class="product-text-name"> Категория: ${ d.category } </div>
				<div class="product-text-name select-product-price"> Стоимость: <span>${ d.price }</span> сум </div>

				<div class="count-input-with-btns-container product-counts">
					<input name="product_quantity" data-price="${ d.price }" type="text" class="form-control numeric-field count-input-with-btns" placeholder="Введите количество товара">
					<input type="hidden" class="selected-product-id" name="product_id">
					
					<div class="form-integer-btns-wrapper gap-2">
						<button type="button" class="btn btn-info plus-btn">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8 0.699219C8.55228 0.699219 9 1.14693 9 1.69922V7H14.2998C14.8521 7 15.2998 7.44772 15.2998 8C15.2998 8.55228 14.8521 9 14.2998 9H9V14.2988C8.99989 14.851 8.55222 15.2988 8 15.2988C7.44778 15.2988 7.00011 14.851 7 14.2988V9H1.7002C1.14791 9 0.700195 8.55228 0.700195 8C0.700195 7.44772 1.14791 7 1.7002 7H7V1.69922C7 1.14693 7.44772 0.699219 8 0.699219Z" fill="white"/>
							</svg>
						</button>

						<button type="button" class="btn btn-info minus-btn">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M14.4014 7.00488C14.9054 7.05631 15.2988 7.48239 15.2988 8C15.2988 8.51761 14.9054 8.94369 14.4014 8.99512L14.2988 9H1.7002C1.14791 9 0.700195 8.55228 0.700195 8C0.700195 7.44772 1.14791 7 1.7002 7H14.2988L14.4014 7.00488Z" fill="white"/>
							</svg>
						</button>
					</div>
				</div>

				<div class="count-input-with-btns-container product-counts">
					<textarea name="note" class="form-control" placeholder="Ваши пожелание"></textarea>
				</div>
				
			</div>
		</div>`
}


$('.select-col-cads').on('click', '.product-card', function (e) {
	e.preventDefault();

	let productCard = $(this);
	let productId = productCard.attr('product-id');
	let selected = $('.selected-products').find(`.selected-product[selected-product-id="${ productId }"]`)


	if (!selected.length) {
		let data = {
			id: productId,
			name: productCard.attr('product-name'),
			category: productCard.attr('product-category'),
			price: productCard.attr('product-price'),
		}
	
		let selectCard = selectProductTemplate(data);
		$('.selected-products').prepend(selectCard);
		
		selected = $('.selected-products').find(`.selected-product[selected-product-id="${ productId }"]`);
		console.log('selected', selected)
		
		let quantity = selected.find('input[name="product_quantity"]');
		quantity.val(1);

		let hiddenInput = selected.find('input[name="product_id"]');
		hiddenInput.val(productId);
		
		productCard.addClass('selected-card');
	} else {
		selected.remove();
		productCard.removeClass('selected-card');
	}
});


$('.selected-products').on('click', '.remove-select-product', function (e) {
	e.preventDefault();

	let selectCard = $(this).closest('.selected-product');
	let selectedProductId = selectCard.attr('selected-product-id');
	let productCard = $('.select-col-cads').find(`.product-card[product-id="${ selectedProductId }"]`)

	if (productCard.length) {
		productCard.removeClass('selected-card');
		selectCard.remove();
	}
});


$('#clear-btn').on('click', function () {
	$('.selected-product').remove();
	$('.selected-card').removeClass('selected-card');
});


$('.submit-btn').on('click', function () {
	$('form.selected-products').submit();
});


$('.next-block-btn').on('click', function () {
	smallScreenFormActive = 1;

	$('.previous-page-btn').css('display', 'none');
	$('.previous-block-btn').css('display', 'block');
	
	$('.next-block-btn').css('display', 'none');
	$('.submit-btn').css('display', 'block');

	$('.select-cads').css('display', 'none');
	$('.select-col-form').css('display', 'flex');
});


$('.previous-block-btn').on('click', function () {
	smallScreenFormActive = 0;
	
	$('.previous-page-btn').css('display', 'block');
	$('.previous-block-btn').css('display', 'none');

	$('.next-block-btn').css('display', 'block');
	$('.submit-btn').css('display', 'none');
	
	$('.select-cads').css('display', 'block');
	$('.select-col-form').css('display', 'none');
});




$(window).on("resize", function () {
    if ($(window).width() <= 840) {
		if (smallScreenFormActive) {
			$('.previous-block-btn').css('display', 'block');
			$('.next-block-btn').css('display', 'none');

	        $('.submit-btn').css('display', 'block');
	        $('.previous-page-btn').css('display', 'none');

			$('.select-cads').css('display', 'none');
			$('.select-col-form').css('display', 'flex');
		} else {
			$('.previous-block-btn').css('display', 'none');
			$('.next-block-btn').css('display', 'block');

			$('.submit-btn').css('display', 'none');
			$('.previous-page-btn').css('display', 'block');
			
			$('.select-cads').css('display', 'block');
			$('.select-col-form').css('display', 'none');
		}
    } else {
		$('.previous-block-btn').css('display', 'none');
		$('.next-block-btn').css('display', 'none');

		$('.submit-btn').css('display', 'block');
		$('.previous-page-btn').css('display', 'block');

		
		$('.select-cads').css('display', 'block');
		$('.select-col-form').css('display', 'flex');
    }
}).trigger("resize"); // чтобы сразу сработало при загрузке





$(document).on('input click focus', '.count-input-with-btns', function () {
	let price = $(this).attr('data-price');
	price = parseInt(price, 10);
	let quantity = $(this).val()
	quantity = quantity !== '' ? quantity : 0

	let result = groupingNumbers(parseInt(quantity * price, 10));
	
	let product = $(this).closest('.selected-product');
	product.find('.select-product-price span').text(result);
});


$(document).on('click', '.form-integer-btns-wrapper button', function () {
	let product = $(this).closest('.selected-product');
	let input = product.find('.count-input-with-btns');
	input.trigger("click");
});