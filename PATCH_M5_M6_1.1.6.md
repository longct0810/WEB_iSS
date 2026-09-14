# Patch M5/M6 — EnMS 1.1.5 → 1.1.6

Patch này chỉ chứa các file cần thay đổi để cập nhật M5 và M6 từ source v1.1.5.

## File chính thay đổi

```text
config/enms-menu.js
public/enms/mock.js
public/enms/js/bootstrap.js
public/enms/js/core/config.js
public/enms/js/pages/realtime.js
public/enms/js/pages/targets.js
public/enms/js/pages/alerts.js
public/enms/css/pages/targets.css
public/enms/css/pages/alerts.css
views/enms/pages/targets/index.ejs
views/enms/pages/targets/_tabs.ejs
views/enms/pages/targets/_summary.ejs
views/enms/pages/targets/_workspace.ejs
views/enms/pages/alerts/index.ejs
views/enms/pages/alerts/_tabs.ejs
views/enms/pages/alerts/_summary.ejs
views/enms/pages/alerts/_workspace.ejs
views/enms/partials/sidebar.ejs
services/enms-service.js
package.json
package-lock.json
tests/enms_modular.test.js
tests/enms_targets_alerts.test.js
README.md
CHANGELOG_ENMS.md
docs/ENMS_V1.1.6.md
```

Không copy đè `.env`, `config/keys`, private key hoặc cấu hình database của server.

Sau khi copy patch:

```bash
npm install
npm test
pm2 restart smartgrid --update-env
```

Sau đó tải lại trình duyệt bằng `Ctrl+F5`.
