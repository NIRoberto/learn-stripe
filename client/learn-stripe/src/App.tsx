import "./App.css";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const stripePromise = loadStripe(
  import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY
);
console.log(import.meta.env);
console.log(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);

const HomePage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-center text-4xl font-bold mt-10">
        Stripe api request
      </h1>
    </div>
  );
};
const CheckoutForm = () => {
  const { register, handleSubmit } = useForm();
  const stripe = useStripe();

  const onSubmit = async (data) => {

    try {
      const response = await axios.post(
        "http://localhost:8080/create-checkout-session",
        {
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "VR Hoodie Product",
                  description: "Comfortable cotton hoodie",
                },
                unit_amount: 2000,
              },
              quantity: 1,
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
                maximum: 10,
              },
            },
          ],
          customer_email: data.email,
        }
      );

      console.log(response.data);

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-6 flex justify-center items-center flex-col">
      <h1 className="text-4xl font-bold mb-4">Checkout</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-[80%]"
      >
        <input
          type="text"
          {...register("name")}
          placeholder="Name"
          className="border-2 p-2 border-l-slate-950"
        />
        <input
          type="text"
          placeholder="Email"
          {...register("email")}
          className="border-2 p-2 rounded-md border-l-slate-950"
        />
        <input
          type="text"
          placeholder="Phone"
          {...register("phone")}
          className="p-2 border-2 rounded-md border-l-slate-950"
        />
        <input
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
        />
      </form>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <div>
          <nav className="bg-gray-800 p-3">
            <ul className="flex justify-center">
              {[
                {
                  path: "/",
                  name: "Home",
                },
                {
                  path: "/checkout",
                  name: "Checkout",
                },
              ].map((route) => (
                <li key={route.path} className="mx-3">
                  <Link to={route.path} className="text-white">
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/success" element={<h1>Success</h1>} />
            <Route path="canceled" element={<h1>Cancel</h1>} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Elements>
    </BrowserRouter>
  );
}

export default App;
