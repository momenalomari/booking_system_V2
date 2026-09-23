import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    let token;

    // 1. التأكد من وجود الهيدر ويبدأ بـ Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // 2. استخراج التوكن (تقسيم النص وأخذ الجزء الثاني فقط)
            token = req.headers.authorization.split(" ")[1];

            // 3. التحقق من التوكن
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. إضافة بيانات المستخدم للطلب
            req.user = decoded;
            console.log("token :", token);  
            
            next();
        } catch (error) {
            // إذا فشل التحقق (توكن منتهي أو معدل)
            console.error("Token verification failed:", error);
            return res.status(401).json({ message: "Token is not valid" });
        }
    } else {
        // إذا لم يتم إرسال توكن أصلاً
        return res.status(401).json({ message: "No token, authorization denied" });
        
    }
};