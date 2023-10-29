const addToCartButtonElement = document.querySelector("#product-details button");
const cartBadgeQuantityElements = document.querySelectorAll(".nav-items .badge");



async function addItemToCart() {
    let response;
    const csrfToken = addToCartButtonElement.dataset.csrf;
    
    try {
        response = await fetch("/cart/items", {
            method: "post",
            body: JSON.stringify({
                productId: addToCartButtonElement.dataset.productid,
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
    const newTotalQuantity = responseData.totalCartItems;

    for( const cartBadgeQuantityElement of cartBadgeQuantityElements){
        cartBadgeQuantityElement.textContent = newTotalQuantity;
    }
}

addToCartButtonElement.addEventListener("click", addItemToCart);
