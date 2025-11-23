# Rover ROSBridge UI (Terminal Theme)

Bu proje, ROS tarafına bağlanmadan önce arayüzü hazırlamak için küçük bir React uygulaması iskeletidir. Tema kod-terminal şeklinde tasarlandı ve JSON/text girdilerini parse edip terminal benzeri alanda gösterir.

Özellikler
- Terminal tema görünümü
- Girdi alanına JSON yapıştırıp Enter ile parse etme
- JSON yapısı okunabilir satırlara dönüştürülür

Kurulum (Windows PowerShell)
```powershell
# Proje dizinine girin
cd "c:\Users\dilge\OneDrive\Masaüstü\rover"

# Node ve npm yüklü ise
npm install
npm run dev
```

Notlar
- Bu iskelet, daha sonra `roslibjs` veya `roslib` ile rosbridge websocket bağlantısı eklemek için hazırdır. İstediğin takdirde ben bağlanma kısmını da eklerim.
