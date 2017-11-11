$(document).ready(function(){
   
    $(".view-product-fade").each(function(index) {
    $(this).delay(300*index).fadeIn(200);
});
    
    $("#plus").click(function(e){
        e.preventDefault();
        
        var price = parseFloat($("#price").val());
        var quantity = parseInt($("#quantity").val());
        
        console.log(price);
        console.log(quantity);
        
        price += parseFloat($("#priceHidden").val());
        quantity += 1;
        
        $('#quantity').val(quantity);
        $("#price").val(price);
        $('#total').html(quantity);
   
    });
    
     $("#minus").click(function(e){
        e.preventDefault();
        
        var price = parseFloat($("#price").val());
        var quantity = parseInt($("#quantity").val());
        
         if(quantity == 1){
             price = parseFloat($("#priceHidden").val());
             quantity = 1;
         }
         else{
            price -= parseFloat($("#priceHidden").val());
            quantity -= 1; 
         }
         
        $('#quantity').val(quantity);
        $("#price").val(price);
        $('#total').html(quantity);
   
    });
    
        
    $("#payWithCard").click(function(){
        $('.cashPayment').fadeOut(300, "swing", function(){
            $(".cardPayment").fadeIn("fast");
        });

    });
    
     $("#payWithCash").click(function(){
        
       
        $('.cardPayment').fadeOut(300, "swing", function(){
             $(".cashPayment").fadeIn("fast");
        } );
    
    });
    
    $("#nav-about").click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#about-section-us").offset().top
        }, 1500);
    });
    $("#nav-contact").click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(".contact-us-section").offset().top
        }, 1500);
    });
    
    $("#nav-home").click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(".home-section").offset().top
        }, 1500);
    });
    
  
        var xda = $(".currSts").text();
        console.log(xda);
        if(xda == 'Buying in progress'){
            $("#1two").attr('checked', 'checked');
        }
        else if(xda == 'Shipping to Address'){
            $("#1tree").attr('checked', 'checked');
        }
        else if(xda == 'Order Delivered'){
            $("#1four").attr('checked', 'checked');
        }
        else {
            $("#1one").attr('checked', 'checked');
        }
      
   
    
   
 
       

});