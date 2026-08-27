import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Chatbot Controller for Sri Vijaylaxmi Textiles
 * Powered by OpenAI GPT-4o-mini / GPT-3.5
 */
export const chatWithAi = async (req, res) => {
  try {
    const { messages = [], userContext = {} } = req.body;

    const openAiKey = process.env.OPENAI_API_KEY;

    // Rich System Prompt representing Sri Vijaylaxmi Heritage & Catalog
    const systemPrompt = `You are "Laxmi", the warm, expert AI Saree Stylist and Customer Concierge for "Sri Vijaylaxmi Textiles (India) Pvt Ltd", Hyderabad's premier silk and handloom saree destination since 1980 (Located at Rikab Gunj, Hyderabad).

Brand Highlights & Store Knowledge:
- Specialties: 100% Authentic Silk Mark Certified sarees.
- Weaves & Collections:
  1. Designer Pattu Gadwal Silk Sarees (₹4,850 - ₹18,500) - Lightweight cotton/silk body with rich contrast pure zari borders and kuttu weaving technique.
  2. Pure Dharmavaram Silk Sarees (₹6,200 - ₹22,000) - Heavy broad zari borders with opulent double-shade pallus, famous for weddings.
  3. Banaras Kadwa Jaal & Katan Silk (₹8,900 - ₹28,000) - Handwoven floral jaal with real gold/silver zari meenakari work.
  4. Pure Handloom Cotton Narayanpet Sarees (₹1,450 - ₹3,800) - Daily & puja wear with traditional temple borders and natural organic dyes.
  5. Wedding Ghagara & Bridal Lehengas (₹12,500 - ₹45,000) - Heavy designer velvet, raw silk with zardozi embroidery.
  6. Mau Rich Pallu & Mau Venkatagiri Buta (₹2,250 - ₹5,800) - Soft art silk and cotton silk with compact zari butis.
  7. Surat Designer Prints & Chiffon Georgette (₹1,150 - ₹4,200) - Modern partywear and festive light drapes.

Store Services:
- Free Insured Shipping across India on orders above ₹1,999. Express 3-5 days delivery.
- Cash on Delivery (COD) available with easy 7-day hassle-free returns.
- Custom Blouse Stitching & Fall Pico services available.
- Store Address: Sri Vijaylaxmi Textiles, Door No: 21-1-764, Rikab Gunj, High Court Road, Hyderabad, Telangana 500002. (Phone: +91 94401 83000 / Email: contact@srivijaylaxmitextiles.com)

Tone & Style:
- Warm, courteous, respectful Indian hospitality (use gentle greetings like "Namaste! 🙏", "Ji", "Aapke liye", etc.).
- Fluent in English, Hindi, and Hinglish. Reply in whatever language the customer speaks to you.
- Give concise, elegant, and helpful recommendations based on the customer's occasion, budget, skin tone, or preference. Mention specific saree weaves and pricing.`;

    if (openAiKey && openAiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        const data = await response.json();

        if (response.ok && data.choices && data.choices[0]?.message) {
          return res.json({
            success: true,
            message: data.choices[0].message.content,
            provider: 'OpenAI GPT-4o-mini',
          });
        } else {
          console.warn('[AI Chat] OpenAI error:', data.error?.message);
        }
      } catch (err) {
        console.warn('[AI Chat] OpenAI API request failed:', err.message);
      }
    }

    // High Quality Knowledge Base Fallback Response
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = 'Namaste! 🙏 Welcome to Sri Vijaylaxmi Textiles. How may I assist you with our authentic handloom saree collection today?';

    if (lastUserMsg.includes('bridal') || lastUserMsg.includes('wedding') || lastUserMsg.includes('shadi')) {
      fallbackReply = 'Namaste! 🙏 For weddings & bridal celebrations, we highly recommend our **Pure Dharmavaram Silk Sarees** (₹6,200 - ₹22,000) and **Banarasi Kadwa Jaal Silk** (₹8,900+). They feature grand golden zari brocade borders and rich temple motifs. Would you like me to recommend specific colors like Royal Crimson Red, Peacock Blue, or Mustard Gold?';
    } else if (lastUserMsg.includes('gadwal') || lastUserMsg.includes('pattu')) {
      fallbackReply = 'Namaste! ✨ Our **Designer Gadwal Silk Sarees** (₹4,850) are handcrafted with pure lightweight body and contrasting heavy zari pallu using traditional Kuttu weaving. They are 100% Silk Mark certified. You can explore them in our Gadwal Silk collection!';
    } else if (lastUserMsg.includes('shipping') || lastUserMsg.includes('delivery') || lastUserMsg.includes('cod')) {
      fallbackReply = '📦 We offer **Free Insured Shipping** across India on orders above ₹1,999! Standard delivery takes 3 to 5 business days. Cash on Delivery (COD) is available with a 7-day easy exchange policy.';
    } else if (lastUserMsg.includes('address') || lastUserMsg.includes('store') || lastUserMsg.includes('location') || lastUserMsg.includes('hyderabad')) {
      fallbackReply = '📍 You are welcome to visit our heritage flagship store: **Sri Vijaylaxmi Textiles**, Door No: 21-1-764, Rikab Gunj, High Court Road, Hyderabad, Telangana 500002. Store Timings: 10:30 AM to 9:00 PM (All 7 days).';
    } else if (lastUserMsg.includes('cotton') || lastUserMsg.includes('narayanpet') || lastUserMsg.includes('daily')) {
      fallbackReply = '🌸 For daily elegance and temple pujas, our **Pure Handloom Cotton Narayanpet Sarees** (₹1,450) are woven with organic breathable cotton and signature traditional zari borders.';
    }

    return res.json({
      success: true,
      message: fallbackReply,
      provider: 'Sri Vijaylaxmi AI Knowledge Engine',
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Namaste! 🙏 How can I assist you with our saree collections today?',
    });
  }
};
