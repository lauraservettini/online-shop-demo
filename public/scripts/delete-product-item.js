const deleteProductButtonElements = document.querySelectorAll(
  ".product-item button"
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.prodid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch("/admin/products/" + productId, {
    method: "DELETE",
    body: JSON.stringify({
      CSRFToken: csrfToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }
  console.log("after delete");
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  console.log("after delete e remove");
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct);
}
