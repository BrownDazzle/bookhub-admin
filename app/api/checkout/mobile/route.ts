import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import axios from "axios";
import { randomUUID } from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
) {
  try {


    const { productIds, shippingAddress, paymentMethod } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: product.title,
          },
          unit_amount: product.price.toNumber() * 100
        }
      });
    });

    const order = await prismadb.order.create({
      data: {
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId
              }
            }
          }))
        },
        address: shippingAddress,
        phone: paymentMethod.number
      }
    });

    if (paymentMethod.network === "MTN MoMo") {
      const session = await axios.post("https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay", {
        amount: paymentMethod.amount,
        currency: "ZMW",
        externalId: randomUUID(),
        payer: {
          partyIdType: paymentMethod.number,
          partyId: randomUUID()
        },
        payerMessage: "Payment was succesfully made.",
        payeeNote: "Payment was succesful."
      })

      return NextResponse.json({ url: session.status }, {
        headers: corsHeaders
      });
    } else if (paymentMethod.network === "Airtel Money") {
      const session = await axios.post("https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay")

      return NextResponse.json({ url: session.status }, {
        headers: corsHeaders
      })
    } else if (paymentMethod.network === "Zamtel Money") {
      const session = await axios.post("https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay")

      return NextResponse.json({ url: session.status }, {
        headers: corsHeaders
      });;
    }


  } catch (error) {
    console.log(error)
  }
};
