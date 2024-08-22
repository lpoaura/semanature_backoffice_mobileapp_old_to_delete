import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

function showNotification(duration, texte, type = 'error') {
    const notyf = new Notyf({
        duration: duration,
        ripple: true
    });

    if (type === 'success') {
        notyf.success(texte);
    } else {
        notyf.error(texte);
    }
    return notyf;
}

export default showNotification;
