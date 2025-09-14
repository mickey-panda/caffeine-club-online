"use server";

import { db } from '../../Firebase/firebase'; // Adjust path to your Firebase config file
import { doc, setDoc, collection, getDocs, DocumentData } from 'firebase/firestore';

// Define the MenuItem interface
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

// Your JSON menu data
const menuItems: MenuItem[] = [
  { id: 0, name: "No Items", category: "No items", price: 0, isAvailable: true },
  { id: 1, name: "Veggie Delight", category: "Pizza", price: 109, isAvailable: true },
  { id: 2, name: "Paneer Tikka", category: "Pizza", price: 139, isAvailable: true },
  { id: 3, name: "Cheese Burst Margherita", category: "Pizza", price: 129, isAvailable: true },
  { id: 4, name: "Chicken Tikka", category: "Pizza", price: 149, isAvailable: true },
  { id: 5, name: "Tandoori Chicken", category: "Pizza", price: 159, isAvailable: true },
  { id: 6, name: "Periperi Chicken", category: "Pizza", price: 149, isAvailable: true },
  { id: 7, name: "White Sauce", category: "Pasta", price: 119, isAvailable: true },
  { id: 8, name: "Red Sauce", category: "Pasta", price: 119, isAvailable: true },
  { id: 9, name: "Pink Sauce", category: "Pasta", price: 119, isAvailable: true },
  { id: 10, name: "Pesto Sauce", category: "Pasta", price: 139, isAvailable: true },
  { id: 11, name: "Aglio Olio", category: "Pasta", price: 129, isAvailable: true },
  { id: 12, name: "Corn Veggie", category: "Sandwich", price: 69, isAvailable: true },
  { id: 13, name: "Corn Veggie Cheese", category: "Sandwich", price: 89, isAvailable: true },
  { id: 14, name: "Paneer Tikka", category: "Sandwich", price: 89, isAvailable: true },
  { id: 15, name: "Paneer Tikka Cheese", category: "Sandwich", price: 109, isAvailable: true },
  { id: 16, name: "Tandoori Chicken", category: "Sandwich", price: 99, isAvailable: true },
  { id: 17, name: "Tandoori Chicken Cheese", category: "Sandwich", price: 119, isAvailable: true },
  { id: 18, name: "Veg", category: "Burger", price: 79, isAvailable: true },
  { id: 19, name: "Double Decker Veg", category: "Burger", price: 109, isAvailable: true },
  { id: 20, name: "Paneer", category: "Burger", price: 109, isAvailable: true },
  { id: 21, name: "Chicken", category: "Burger", price: 109, isAvailable: true },
  { id: 22, name: "Double Decker Chicken", category: "Burger", price: 149, isAvailable: true },
  { id: 23, name: "Classic", category: "Maggie", price: 39, isAvailable: true },
  { id: 24, name: "Veggie", category: "Maggie", price: 49, isAvailable: true },
  { id: 25, name: "Egg", category: "Maggie", price: 69, isAvailable: true },
  { id: 26, name: "Chicken", category: "Maggie", price: 79, isAvailable: true },
  { id: 27, name: "Veg", category: "Momo", price: 89, isAvailable: true },
  { id: 28, name: "Corn Cheese", category: "Momo", price: 109, isAvailable: true },
  { id: 29, name: "Chicken", category: "Momo", price: 129, isAvailable: true },
  { id: 30, name: "Chicken BBQ Fried", category: "Momo", price: 149, isAvailable: true },
  { id: 31, name: "Chicken Kurkure Fried", category: "Momo", price: 149, isAvailable: true },
  { id: 32, name: "Veg Kurkure Fried", category: "Momo", price: 129, isAvailable: true },
  { id: 33, name: "Nutella", category: "Waffle", price: 109, isAvailable: true },
  { id: 34, name: "Lotus Biscoff", category: "Waffle", price: 119, isAvailable: true },
  { id: 35, name: "Kitkat", category: "Waffle", price: 119, isAvailable: true },
  { id: 36, name: "Maple Butter", category: "Waffle", price: 99, isAvailable: true },
  { id: 37, name: "Blueberry", category: "Waffle", price: 89, isAvailable: true },
  { id: 38, name: "Strawberry", category: "Waffle", price: 89, isAvailable: true },
  { id: 39, name: "Nutella Cloud", category: "Waffle with Ice-Cream", price: 139, isAvailable: true },
  { id: 40, name: "Biscoff Crunch Melt", category: "Waffle with Ice-Cream", price: 149, isAvailable: true },
  { id: 41, name: "Strawberry Fantasy", category: "Waffle with Ice-Cream", price: 119, isAvailable: true },
  { id: 42, name: "Vanilla", category: "Ice Cream", price: 30, isAvailable: true },
  { id: 43, name: "Chocolate", category: "Ice Cream", price: 35, isAvailable: true },
  { id: 44, name: "Strawberry", category: "Ice Cream", price: 30, isAvailable: true },
  { id: 45, name: "Chocochips", category: "Ice Cream", price: 35, isAvailable: true },
  { id: 46, name: "Black Currant", category: "Ice Cream", price: 45, isAvailable: true },
  { id: 47, name: "Butterscotch", category: "Ice Cream", price: 35, isAvailable: true },
  { id: 48, name: "Caramel Biscotti", category: "Special Ice Cream", price: 50, isAvailable: true },
  { id: 49, name: "Choco Overload", category: "Special Ice Cream", price: 55, isAvailable: true },
  { id: 50, name: "Strawberry Pop", category: "Special Ice Cream", price: 50, isAvailable: true },
  { id: 51, name: "Berry-Nut Crave", category: "Special Ice Cream", price: 65, isAvailable: true },
  { id: 52, name: "Smiles(4)", category: "Snacks", price: 59, isAvailable: true },
  { id: 53, name: "Veg Nuggets(6)", category: "Snacks", price: 89, isAvailable: true },
  { id: 54, name: "Veg Fingers(6)", category: "Snacks", price: 109, isAvailable: true },
  { id: 55, name: "Chicken Nuggets(6)", category: "Snacks", price: 119, isAvailable: true },
  { id: 56, name: "Chicken Fingers(6)", category: "Snacks", price: 119, isAvailable: true },
  { id: 57, name: "Chicken Cheese Balls(6)", category: "Snacks", price: 139, isAvailable: true },
  { id: 58, name: "Chicken Strips(4)", category: "Snacks", price: 139, isAvailable: true },
  { id: 59, name: "Chicken Popcorn(150Gms)", category: "Snacks", price: 149, isAvailable: true },
  { id: 60, name: "Chicken Wings(4)", category: "Snacks", price: 159, isAvailable: true },
  { id: 61, name: "Veg Spring Roll(4)", category: "Snacks", price: 109, isAvailable: true },
  { id: 62, name: "Paneer Spring Roll(4)", category: "Snacks", price: 129, isAvailable: true },
  { id: 63, name: "Chicken Spring Roll(4)", category: "Snacks", price: 129, isAvailable: true },
  { id: 64, name: "Salted", category: "French Fries", price: 79, isAvailable: true },
  { id: 65, name: "Peri Peri", category: "French Fries", price: 99, isAvailable: true },
  { id: 66, name: "Regular Tea", category: "Hot Beverages", price: 15, isAvailable: true },
  { id: 67, name: "Ginger Tea", category: "Hot Beverages", price: 20, isAvailable: true },
  { id: 68, name: "Elaichi Tea", category: "Hot Beverages", price: 20, isAvailable: true },
  { id: 69, name: "Coffee", category: "Hot Beverages", price: 20, isAvailable: true },
  { id: 70, name: "Espresso", category: "Hot Beverages", price: 20, isAvailable: true },
  { id: 71, name: "Cappuccino", category: "Hot Beverages", price: 30, isAvailable: true },
  { id: 72, name: "Latte", category: "Hot Beverages", price: 35, isAvailable: true },
  { id: 73, name: "Mocha", category: "Hot Beverages", price: 45, isAvailable: true },
  { id: 74, name: "Boost", category: "Hot Beverages", price: 30, isAvailable: true },
  { id: 75, name: "Horlicks", category: "Hot Beverages", price: 30, isAvailable: true },
  { id: 76, name: "Hot Chocolate", category: "Hot Beverages", price: 40, isAvailable: true },
  { id: 77, name: "Lemon Tea", category: "Hot Beverages", price: 20, isAvailable: true },
  { id: 78, name: "Green Tea", category: "Hot Beverages", price: 25, isAvailable: true },
  { id: 79, name: "Classic", category: "Cold Coffee", price: 49, isAvailable: true },
  { id: 80, name: "Classic with Ice Cream", category: "Cold Coffee", price: 69, isAvailable: true },
  { id: 81, name: "Mocha", category: "Cold Coffee", price: 69, isAvailable: true },
  { id: 82, name: "Hazelnut Cold Coffee", category: "Cold Coffee", price: 79, isAvailable: true },
  { id: 83, name: "Caramel Cold Coffee", category: "Cold Coffee", price: 89, isAvailable: true },
  { id: 84, name: "Latte", category: "Cold Coffee", price: 79, isAvailable: true },
  { id: 85, name: "Virgin", category: "Mojito", price: 49, isAvailable: true },
  { id: 86, name: "Lime & Mint", category: "Mojito", price: 49, isAvailable: true },
  { id: 87, name: "Blue Lagoon", category: "Mojito", price: 49, isAvailable: true },
  { id: 88, name: "Orange Crush", category: "Mojito", price: 59, isAvailable: true },
  { id: 89, name: "Mango Crush", category: "Mojito", price: 59, isAvailable: true },
  { id: 90, name: "Strawberry Crush", category: "Mojito", price: 59, isAvailable: true },
  { id: 91, name: "Water Melon", category: "Mojito", price: 59, isAvailable: true },
  { id: 92, name: "Kiwi", category: "Mojito", price: 69, isAvailable: true },
  { id: 93, name: "Vanilla", category: "Milkshakes", price: 49, isAvailable: true },
  { id: 94, name: "Butterscotch", category: "Milkshakes", price: 59, isAvailable: true },
  { id: 95, name: "Chocolate", category: "Milkshakes", price: 59, isAvailable: true },
  { id: 96, name: "Strawberry", category: "Milkshakes", price: 59, isAvailable: true },
  { id: 97, name: "Mango", category: "Milkshakes", price: 69, isAvailable: true },
  { id: 98, name: "Kitkat", category: "Milkshakes", price: 79, isAvailable: true },
  { id: 99, name: "Oreo", category: "Milkshakes", price: 59, isAvailable: true },
  { id: 100, name: "Nutella", category: "Milkshakes", price: 79, isAvailable: true },
  { id: 101, name: "Brownie", category: "Milkshakes", price: 69, isAvailable: true },
  { id: 102, name: "Chicken", category: "Add Ons", price: 30, isAvailable: true },
  { id: 103, name: "Cheese", category: "Add Ons", price: 20, isAvailable: true },
  { id: 104, name: "Peri Peri", category: "Add Ons", price: 10, isAvailable: true },
  { id: 105, name: "Grill Sandwich", category: "Add Ons", price: 10, isAvailable: true },
  { id: 106, name: "Fried Momo", category: "Add Ons", price: 15, isAvailable: true },
  { id: 107, name: "Water Bottle", category: "Add Ons", price: 10, isAvailable: true },
  { id: 108, name: "Cold Drink", category: "Add Ons", price: 20, isAvailable: true },
  { id: 109, name: "Brownie", category: "Brownies", price: 89, isAvailable: true },
  { id: 110, name: "Walnut Brownie", category: "Brownies", price: 99, isAvailable: true },
  { id: 111, name: "Sizzler Brownie", category: "Brownies", price: 169, isAvailable: true },
  { id: 112, name: "Sizzler Double Brownie", category: "Brownies", price: 189, isAvailable: true },
  { id: 113, name: "Onion Rings(6)", category: "Snacks", price: 109, isAvailable: true },
  { id: 114, name: "Paneer", category: "Tortilla Wrap", price: 129, isAvailable: true },
  { id: 115, name: "Egg", category: "Tortilla Wrap", price: 109, isAvailable: true },
  { id: 116, name: "Chicken", category: "Tortilla Wrap", price: 139, isAvailable: true },
  { id: 117, name: "Chicken And Egg", category: "Tortilla Wrap", price: 159, isAvailable: true },
  { id: 118, name: "Vanilla Muffins", category: "Muffins", price: 20, isAvailable: true },
  { id: 119, name: "Chocolate Muffins", category: "Muffins", price: 25, isAvailable: true }
];

export async function POST(): Promise<Response> {
  try {
    // Upload each menu item to the "menu" collection
    const uploadPromises = menuItems.map(async (item: MenuItem) => {
      const docRef = doc(db, 'menu', item.id.toString());
      await setDoc(docRef, {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        isAvailable: item.isAvailable,
      });
    });

    // Execute all uploads concurrently
    await Promise.all(uploadPromises);

    return new Response(JSON.stringify({ message: 'Menu items uploaded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error uploading menu items:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ message: 'Error uploading menu items', error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    // Fetch all documents from the "menu" collection
    const menuCollection = collection(db, 'menu');
    const querySnapshot = await getDocs(menuCollection);
    
    // Map documents to an array of menu items
    const menuItems: MenuItem[] = querySnapshot.docs.map((doc: DocumentData) => ({
      id: doc.data().id,
      name: doc.data().name,
      category: doc.data().category,
      price: doc.data().price,
      isAvailable: doc.data().isAvailable,
    }));

    // Sort by id to ensure consistent order
    menuItems.sort((a: MenuItem, b: MenuItem) => a.id - b.id);

    return new Response(JSON.stringify({ message: 'Menu items retrieved successfully', data: menuItems }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error retrieving menu items:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ message: 'Error retrieving menu items', error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}