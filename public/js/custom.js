$(document).ready(function(){
   
    
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
        
        $(".cardPayment").show();
        $('.cashPayment').hide();
    
    });
    
     $("#payWithCash").click(function(){
        
        $(".cashPayment").show();
        $('.cardPayment').hide();
    
    });
    
   

});