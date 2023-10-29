const updateOrderFormElements = document.querySelectorAll(
    '.order-actions form'
  );
  
  async function updateOrder(event) {
    event.preventDefault();
    const form = event.target;
  
    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('CSRFToken');
  
    let response;
    
    try {
      response = await fetch(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          newStatus: newStatus,
          CSRFToken: csrfToken,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      alert('Something went wrong - could not update order status.');
      return;
    }
    
    console.log(response.status);

    if (!response.ok) {
        console.log("er 2");
      alert('Something went wrong - could not update order status.');
      return;
    }
  
    const responseData = await response.json();
  
    form.parentElement.parentElement.querySelector('.badge').textContent =
      responseData.newStatus.toUpperCase();
  }
  
  for (const updateOrderFormElement of updateOrderFormElements) {
    updateOrderFormElement.addEventListener('submit', updateOrder);
  }