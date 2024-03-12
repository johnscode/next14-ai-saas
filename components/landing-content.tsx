"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "James",
    description: "Simple, powerful, and intuitive!",
  },
  {
    name: "Nancy",
    description: "Streamlined my workflow like never before!",
  },
  {
    name: "Tonya",
    description: "Incredibly user-friendly and efficient!",
  },
  {
    name: "Brandon",
    description: "An indispensable tool for our team!",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">Testimonials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0 italic">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}