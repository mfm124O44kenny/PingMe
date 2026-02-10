export default function adminOnly(req, res, next) {
    const cookie = req.cookies.admin;
    if (!cookie) {
      const content = "<html style='background-color: black;'><script>async function login(){const name = prompt('Entrez votre nom');const secret = prompt('Entrez votre code secret');try{const res = await fetch('/admin/', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({ name, secret })});if (res.ok) {alert('✅ Authentification réussie !');window.location.href = '/admin';} else {alert('❌ Nom ou code secret incorrect'); window.location.href = '/';}}catch (err) {alert('⚠️ Erreur serveur');console.error(err);}} login();</script></html>"
      res.type('html');
      return res.send(content); // pas connecté → alors on login
    }
  
    try {
      req.user = JSON.parse(cookie);
      if (!req.user.fullName.toLowerCase().includes("fotso")) {
        return res.status(403).send("Admin only");
      }
      next();
    } catch {
      return res.redirect("/");
    }
  }
  