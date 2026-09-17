import React from 'react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      backgroundColor: '#1E293B', // نفس لون النافبار
      color: '#94A3B8', // لون سكني فاتح مريح للقراءة
      padding: '20px 40px', 
      borderTop: '2px solid #0F172A',
      marginTop: 'auto'
    }}>
      
      <div style={{ 
        maxWidth: '1300px', 
        margin: 'auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap', // عشان يكون متجاوب مع الشاشات الصغيرة
        gap: '15px'
        
      }}>
        
        {/* حقوق النشر واسم النظام */}
       
          <p style={{ margin: 0, fontSize: '14px' , justifyContent: 'center', textAlign: 'center', width: '100%' }}>
            &copy; {currentYear} <span style={{ color: '#4CAF50', fontWeight: 'bold', letterSpacing: '0.5px' }}>Stadium Booking System</span>. All rights reserved.
          </p>
        


      </div>
    </footer>
  );
}