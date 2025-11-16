import Swal from 'sweetalert2';

function genCode() {
  return `MSG-${String(Date.now()).slice(-6)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}

export async function showConfirm(message, title = 'ยืนยัน') {
  const code = genCode();
  const res = await Swal.fire({
    title,
    html: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก',
    footer: `<span style="font-size:12px">รหัส: ${code}</span>`,
  });
  return !!res.isConfirmed;
}

export function showSuccess(message, title = 'เรียบร้อย', opts = {}) {
  const code = opts.code || genCode();
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    showConfirmButton: false,
    timer: opts.timer || 2000,
    footer: `<span style="font-size:12px">รหัส: ${code}</span>`,
  });
}

export function showError(message, title = 'เกิดข้อผิดพลาด') {
  const code = genCode();
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    footer: `<span style="font-size:12px">รหัส: ${code}</span>`,
  });
}

export function showInfo(message, title = '') {
  const code = genCode();
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    showConfirmButton: false,
    timer: 1800,
    footer: `<span style="font-size:12px">รหัส: ${code}</span>`,
  });
}

export default {
  showConfirm,
  showSuccess,
  showError,
  showInfo,
};
