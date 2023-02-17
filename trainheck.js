
    $(document).ready(function() {
        $('.btnClose').on('click', function () {
            releaseAllSeats();
            $(this).closest('.trip-div').find('.single-seat-class').removeClass('selected');
            $(this).closest('.seat-layout-view').empty();
        });
        $(window).on('unload', function(){
            releaseAllSeats(); //app/views/www/search-bus-trips-seats.blade.php
        });
        let el = document.querySelector('.view_seat_bg');
        let  parentScrollPosition = el.getAttribute('data-tripId');
        // $(`#trip${parentScrollPosition}`)[0].scrollIntoView();

    });
    function toTitleCase(str)
    {
        return str.replace(/\b\w/g, function (txt) { return txt.toUpperCase(); });
    }
    function submitConfirm(objContBtn)
    {
        var allOkay = true;
        var is_eid_ticket = '0';
        $('#errormsg').addClass('hidden');
        $('#errormsg2').addClass('hidden');

        // Check internet connection
        if(window.navigator.onLine === false){
            $('#errormsg').text('Please check your internet connection.').removeClass('hidden');
            allOkay = false;
        }
        if ($('#tbl_price_details').find('table#tbl_seat_list').find('tbody:eq(0)').find('tr').length < 1) {
            $('#errormsg').text('Please choose seat(s)!').removeClass('hidden');
            allOkay = false;
        } else if ($('#boardingpoint').val() < 1) {
            $('#errormsg').text('Please choose a boarding point').removeClass('hidden');
            allOkay = false;
        } else if (is_eid_ticket == 1 && $('#dropingpoint').val() < 1) {
            $('#errormsg2').text('Please choose a droping point').removeClass('hidden');
            allOkay = false;
        }

        if (allOkay) {
            $(window).off('unload');
            $('#searchid').val($('#www-search-id').val());

            //Track Facebook Event - InitiateCheckout
            var totalTixPrice = $('#tickets_total').find('p').find('b').text();
            fbq('track', 'InitiateCheckout', {
                value: totalTixPrice.substr(7),
                currency: 'BDT',
                num_items: $('#tbl_price_details').find('table#tbl_seat_list').find('tbody:eq(0)').find('tr').length
            });

            $('form#confirmbooking').submit();
        }
    }
    function chooseSeat(seatObj)
    {
        //debugger
        $('#seatError').addClass('hidden');
        var $seatObj = $(seatObj);
        if($seatObj.hasClass("request_pending")) {
            return;
        } else {
            $seatObj.addClass("request_pending");
            $('.continue-btn').addClass("continue-btn-disabled");
        }
        var $seatTableBody = $('#tbl_price_details').find('table#tbl_seat_list').find('tbody:eq(0)');
        var sData = $seatObj.parent().data('seat');
        var tripData = $('.single-seat-class.selected').data('seat-type');
        var discountAmount = 0;

        if ($seatObj.hasClass('selected')) {
            //un select a seat
            $seatObj.removeClass('selected');
            //alert('#' + sData.ticket_id);
            $('#' + sData.ticket_id).remove();
            $.ajax({
                url: '/booking/train/seat/release',
                type: 'POST',
                data: {"ticketid":sData.ticket_id,6
                    "routeid":tripData.trip_route_id,
                    "searchid":$('#www-search-id').val()}
            }).done(function(data) {
                $seatObj.removeClass("request_pending");
                $('.continue-btn').removeClass("continue-btn-disabled");
            });

            var ticketPrice = 0;
            var discountValue = 0;
            var discountType = 1;

            switch (parseInt(sData.fare_type_id)) {
                case 1:
                    ticketPrice = tripData.fare;
                    if (discountType == 1){
                        discountAmount = Math.floor( (ticketPrice / 100) * discountValue )
                    } else {
                        discountAmount = discountValue;
                    }
                    break;
            }

            doTicketsTotal(discountAmount);

        } else {

            if (searchtocity == 'kolkata' && companyId == soudiaOperatorID)
            {
                maxTickets = maxSoudiaKolTix;
            }
            // if (companyId == emadOperatorId)
            // {
            //     maxTickets = maxEmadTix;
            // }
            if ($seatTableBody.find('tr').length < maxTickets) {
                //select a seat
                var ticketPrice = 0;
                var discountTicketPrice = 0;
                var ticketPriceString = '';
                var discountValue = 0;
                var discountType = 1;
                switch (parseInt(sData.fare_type_id)) {
                    case 1:
                        ticketPrice = tripData.fare;
                        if (discountType == 1){
                            discountAmount = Math.floor((ticketPrice / 100) * discountValue)
                        } else {
                            discountAmount = discountValue;
                        }
                        discountTicketPrice = tripData.fare - discountAmount;
                        break;
                }
                if (0 > 0)
                {
                    ticketPriceString = '<strike style="color:red; font-size: 10px;">' + ticketPrice + '</strike> ' + discountTicketPrice + '.00';
                }
            else
                {
                    ticketPriceString = ticketPrice;
                }

                var tr = '<tr id="' + sData.ticket_id + '"><td>' + tripData.type + '<input type="hidden" name="ticket[]" value="' + sData.ticket_id + '"/><input type="hidden" name="triproute[]" value="' + tripData.trip_route_id + '"/></td><td width="140">' + sData.seat_number + '</td><td width="118">' + ticketPriceString + '</td></tr>';
                $seatTableBody.append(tr);
                $.ajax({
                    url: '/booking/train/seat/reserve',
                    type: 'POST',
                    data: {"ticketid":sData.ticket_id,
                        "routeid":tripData.trip_route_id,
                        "searchid":$('#www-search-id').val()}
                }).done(function(response) {
                    $seatObj.removeClass("request_pending");
                    $('.continue-btn').removeClass("continue-btn-disabled");
                    $seatObj.addClass('selected');
                    if (response.ack != 1) {
                        $seatObj.removeClass('selected');
                        $('#' + sData.ticket_id).remove();
                        $('#seatError').html('<div class="railway-form-error">Sorry! this ticket is not available now.</div>').css({'width': '100%', 'overflow': 'hidden'});
                        $('#seatError').removeClass('hidden');
                        $seatObj.addClass('booked');
                        $seatObj.removeAttr('onclick');
                        doTicketsTotal(discountAmount);
                        var totalFare = parseFloat($('div#tickets_total > p').attr('data-tickets-total'));
                        if(totalFare === 0){
                            $('.continue-btn').addClass("continue-btn-disabled");
                        }
                    }
                }).fail(()=> {
                   // $seatObj.removeClass("request_pending");
                    $seatObj.removeClass('selected');
                });

                doTicketsTotal(discountAmount);

            } else {
                $seatObj.removeClass("request_pending");
                $('.continue-btn').removeClass("continue-btn-disabled");
                $('#seatError').html('<div class="error-partial col-lg-12" style="padding:5px 20px;margin-top:0px;"><i class="fa fa-exclamation-triangle" style="font-size:20px;"></i><div class="error-message-div" style="padding:2px;">Maximum ' + maxTickets + ' seats can be booked at a time.</div></div>');
                $('#seatError').removeClass('hidden');
            }


        }


    }
    function doTicketsTotal(discountAmount)
    {
        var ticketsTotal = 0;
        var $seatTableBody = $('#tbl_price_details').find('table#tbl_seat_list').find('tbody:eq(0)');
        var $seatTableTr = $seatTableBody.find('tr');
        $.each($seatTableTr, function(index, trObj) {
            ticketsTotal += parseFloat($(trObj).find('td:eq(2)').text()) - discountAmount;
        });
        $('div#tickets_total').html('<p data-tickets-total="'+ticketsTotal+'"><b>Total: &nbsp;৳ ' + ticketsTotal + '</b></p>');
    }
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })