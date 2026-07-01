import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "English" | "Hindi" | "Marathi";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  English: {},
  Hindi: {
    // Sidebar & Menus
    "Dashboard": "डैशबोर्ड",
    "Sales": "बिक्री",
    "Sales List": "बिक्री सूची",
    "Add Sales": "बिक्री जोड़ें",
    "POS": "पीओएस",
    "Return Sales": "बिक्री वापसी",
    "Customers": "ग्राहक",
    "Products": "उत्पाद",
    "Users": "उपयोगकर्ता",
    "Roles": "भूमिकाएं",
    "Advance": "अग्रिम",
    "Main Menu": "मुख्य मेनू",

    // Headers & Dropdown Actions
    "Super Admin": "सुपर एडमिन",
    "Tenant Admin": "किराया व्यवस्थापक",
    "User": "उपयोगकर्ता",
    "Sign out": "साइन आउट",
    "Update Profile": "प्रोफ़ाइल अपडेट करें",
    "Change Password": "पासवर्ड बदलें",
    "Notifications": "सूचनाएं",
    "Clear all": "सभी साफ करें",
    "No unread notifications": "कोई नई सूचनाएं नहीं",

    // General Common UI
    "Search": "खोजें",
    "Search...": "खोजें...",
    "Save": "सहेजें",
    "Cancel": "रद्द करें",
    "Edit": "संपादित करें",
    "Delete": "हटाएं",
    "Save Changes": "बदलाव सहेजें",
    "Actions": "कार्रवाई",
    "Status": "स्थिति",
    "Amount": "रकम",
    "Date": "तारीख",
    "Price": "कीमत",
    "Name": "नाम",
    "Email": "ईमेल",
    "Phone": "फ़ोन",

    // Dashboard Screen
    "Overview of your business performance": "आपके व्यावसायिक प्रदर्शन का अवलोकन",
    "Sales Due": "बिक्री देय",
    "Purchase Due": "खरीद देय",
    "Total Sales": "कुल बिक्री",
    "Expense": "व्यय",
    "Recent Sales Invoices": "हालिया बिक्री चालान",
    "Stock Alert": "स्टॉक चेतावनी",
    "Trending Products": "प्रचलित उत्पाद",
    "Invoice": "चालान",
    "Customer": "ग्राहक",
    "Recent Products": "हालिया उत्पाद",
    "Stock Quantity": "स्टॉक मात्रा",
    "Unit Price": "इकाई मूल्य",
    "Trending Items": "ट्रेंडिंग आइटम",
    "Quantity": "मात्रा",
    "Stock Alert Items": "स्टॉक चेतावनी आइटम",
    "SKU": "एसकेयू",
    "Current Stock": "वर्तमान स्टॉक",
    
    // Count Cards
    "Invoices": "चालान",
    "Paid Invoices": "भुगतान किए गए चालान",
    
    // Period Filters
    "Today": "आज",
    "Weekly": "साप्ताहिक",
    "Monthly": "मासिक",
    "Yearly": "वार्षिक",
    "All": "सभी",

    // Bar Chart
    "Purchase, Sales & Expense Bar Chart": "खरीद, बिक्री और व्यय चार्ट",
    "Purchase": "खरीद",

    // Table Headers
    "SL.No": "क्र.सं.",
    "Item Name": "सामग्री का नाम",
    "Sales Price": "बिक्री मूल्य",
    "Stock": "स्टॉक",
    "Unit": "इकाई",

    // Datatable Controls
    "Show": "दिखाएं",
    "entries": "प्रविष्टियां",
    "Copy": "कॉपी",
    "Excel": "एक्सेल",
    "CSV": "सीएसवी",
    "Print": "प्रिंट",
    "Columns": "कॉलम",
    "Showing": "दिखा रहा है",
    "to": "से",
    "of": "में से",
    "Previous": "पिछला",
    "Next": "अगला",

    // Notifications Mock Texts
    "Welcome to BillBook workspace!": "बिलबुक वर्कस्पेस में आपका स्वागत है!",
    "Low stock alert: Premium Widget is below 10 units": "कम स्टॉक अलर्ट: प्रीमियम विजेट 10 इकाइयों से नीचे है",
    "New customer Rohal Retail Pvt Ltd registered": "नया ग्राहक रोहल रिटेल प्राइवेट लिमिटेड पंजीकृत",
  },
  Marathi: {
    // Sidebar & Menus
    "Dashboard": "डॅशबोर्ड",
    "Sales": "विक्री",
    "Sales List": "विक्री सूची",
    "Add Sales": "विक्री जोडा",
    "POS": "पीओएस",
    "Return Sales": "विक्री परतावा",
    "Customers": "ग्राहक",
    "Products": "उत्पादने",
    "Users": "वापरकर्ते",
    "Roles": "भूमिका",
    "Advance": "आगाऊ रक्कम",
    "Main Menu": "मुख्य मेनू",

    // Headers & Dropdown Actions
    "Super Admin": "सुपर प्रशासक",
    "Tenant Admin": "भाडेकरू प्रशासक",
    "User": "वापरकर्ता",
    "Sign out": "साइन आउट",
    "Update Profile": "प्रोफाइल अपडेट करा",
    "Change Password": "पासवर्ड बदला",
    "Notifications": "अधिसूचना",
    "Clear all": "सर्व साफ करा",
    "No unread notifications": "कोणतीही नवीन अधिसूचना नाही",

    // General Common UI
    "Search": "शोधा",
    "Search...": "शोधा...",
    "Save": "जतन करा",
    "Cancel": "रद्द करा",
    "Edit": "संपादित करा",
    "Delete": "हटवा",
    "Save Changes": "बदलाव जतन करा",
    "Actions": "कृती",
    "Status": "स्थिती",
    "Amount": "रक्कम",
    "Date": "तारीख",
    "Price": "किंमत",
    "Name": "नाव",
    "Email": "ईमेल",
    "Phone": "फोन",

    // Dashboard Screen
    "Overview of your business performance": "तुमच्या व्यवसायाच्या कामगिरीचे विहंगावलोकन",
    "Sales Due": "विक्री देय",
    "Purchase Due": "खरेदी देय",
    "Total Sales": "एकूण विक्री",
    "Expense": "खर्च",
    "Recent Sales Invoices": "अलीकडील विक्री पावत्या",
    "Stock Alert": "स्टॉक चेतावणी",
    "Trending Products": "ट्रेंडिंग उत्पादने",
    "Invoice": "पावती",
    "Customer": "ग्राहक",
    "Recent Products": "अलीकडील उत्पादने",
    "Stock Quantity": "स्टॉक प्रमाण",
    "Unit Price": "युनिट किंमत",
    "Trending Items": "ट्रेंडिंग वस्तू",
    "Quantity": "प्रमाण",
    "Stock Alert Items": "स्टॉक अलर्ट वस्तू",
    "SKU": "एसकेयू",
    "Current Stock": "सध्याचा स्टॉक",

    // Count Cards
    "Invoices": "पावत्या",
    "Paid Invoices": "भरलेल्या पावत्या",

    // Period Filters
    "Today": "आज",
    "Weekly": "साप्ताहिक",
    "Monthly": "मासिक",
    "Yearly": "वार्षिक",
    "All": "सर्व",

    // Bar Chart
    "Purchase, Sales & Expense Bar Chart": "खरेदी, विक्री आणि खर्च चार्ट",
    "Purchase": "खरेदी",

    // Table Headers
    "SL.No": "अनु.क्र.",
    "Item Name": "वस्तूचे नाव",
    "Sales Price": "विक्री किंमत",
    "Stock": "स्टॉक",
    "Unit": "युनिट",

    // Datatable Controls
    "Show": "दाखवा",
    "entries": "नोंदी",
    "Copy": "कॉपी",
    "Excel": "एक्सेल",
    "CSV": "सीएसवी",
    "Print": "प्रिंट",
    "Columns": "कॉलम",
    "Showing": "दर्शवत आहे",
    "to": "ते",
    "of": "पैकी",
    "Previous": "मागील",
    "Next": "पुढील",

    // Notifications Mock Texts
    "Welcome to BillBook workspace!": "बिलबुक वर्कस्पेसमध्ये आपले स्वागत आहे!",
    "Low stock alert: Premium Widget is below 10 units": "कमी स्टॉक चेतावणी: प्रीमियम विजेट 10 युनिट्सपेक्षा कमी आहे",
    "New customer Rohal Retail Pvt Ltd registered": "नवीन ग्राहक रोहल रिटेल प्रायव्हेट लिमिटेड नोंदणीकृत झाली",
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("billbook_lang");
    return (saved === "Hindi" || saved === "Marathi" ? saved : "English") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("billbook_lang", lang);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && key in langDict) {
      return langDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
