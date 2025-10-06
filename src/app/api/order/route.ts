// File: app/api/online-order/route.ts

"use server";

import { db } from '../../Firebase/firebase'; // Adjust path to your Firebase config
import { collection, addDoc, Timestamp } from 'firebase/firestore';

type OrderStatus = "placed" | "confirmed" | "paid" | "delivered" | "canceled" | "refunded";

// Define the interface for a single item in an order
interface OrderItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// Define the interface for the entire order
interface Order {
  items: OrderItem[];
  total: number;
  slot: Date;
  createdAt: Timestamp;
  status: OrderStatus;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { cart, discounted, selectedSlot, orderStatus } = body;

    if (!cart || !discounted || !selectedSlot || !orderStatus) {
      return new Response(JSON.stringify({ message: 'Missing required order data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare the data for Firestore
    const orderData: Order = {
      items: cart,
      total: discounted,
      slot: new Date(selectedSlot), // Ensure slot is a Date object
      createdAt: Timestamp.now(), // Add a server-side timestamp
      status: orderStatus
    };

    // Add a new document with an auto-generated ID to the "online-orders" collection
    const docRef = await addDoc(collection(db, 'online-orders'), orderData);

    return new Response(JSON.stringify({ message: 'Order saved successfully', orderId: docRef.id }), {
      status: 201, // 201 Created is more appropriate here
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error saving order to Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ message: 'Error saving order', error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
