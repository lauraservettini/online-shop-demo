const cartBadgeQuantityElements = document.querySelectorAll(".nav-items .badge");
const updateItemCartButtonElements = document.querySelectorAll(".cart-item-management button");

async function updateItemToCart(event) {
    event.preventDefault();

    let response;

    const button = event.target
    const quantityInputElement =  button.parentElement.children[0];
    const csrfToken = quantityInputElement.dataset._csrf;
    
    try {
        response = await fetch("/cart/items", {
            method: "PATCH",
            body: JSON.stringify({
                productId: quantityInputElement.dataset.productid,
                quantity: quantityInputElement.value,
                CSRFToken: csrfToken
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        
    } catch (error) {
        alert("Something went wrong!");
        return
    }

    if(!response.ok){
        alert("Something went wrong!");
        return
    }
    
    let responseData;
    try {
        responseData = await response.json();
      
    } catch (error) {
        alert("Something went wrong!");
    }
    
    //aggiorna quantità e prezzo totale del carrello
    const cartTotalPrice = document.getElementById("cart-total-price");
    cartTotalPrice.textContent = responseData.newTotalCartPrice.toFixed(2);

    for(const cartBadgeQuantityElement of cartBadgeQuantityElements){
        cartBadgeQuantityElement.textContent = responseData.newTotalCartQuantity;
    }

    //cancella l'elemento li dalla pagina se la quantità è 0
    if(!responseData.itemUpdated || responseData.itemUpdated === 0){
        const liItemElement = button.parentElement.parentElement.parentElement;
        liItemElement.remove();
        return;
    }

    //aggiorna quantità e prezzo totale sull'item
    const cartItemTotalPrice = button.parentElement.parentElement.querySelector(".total-item-price");
    cartItemTotalPrice.textContent = responseData.itemUpdated.totalPrice.toFixed(2);
    
    quantityInputElement.value = responseData.itemUpdated.quantity;
}

for(const updateItemCartButtonElement of updateItemCartButtonElements){
    updateItemCartButtonElement.addEventListener("click", updateItemToCart);
}