/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

export default function EmployeeDetailModal({ open, onClose, employee }) {
  if (!employee) return null;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("th-TH") : "-";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(to bottom, #ffffff, #F3F7FB)",
          width: "60%",
        },
      }}
    >
      {/* 🔹 Header */}
      <DialogTitle
        sx={{
          color: "#3674B5",
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 2.5,
        }}
      >
        <Avatar
          src={employee.profileImage || ""}
          sx={{ width: 50, height: 50 }}
        />
        <div>
          <h2 className="text-xl font-semibold">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-sm">
            {employee.positionId?.positionName || "ไม่ระบุตำแหน่ง"}
          </p>
        </div>
      </DialogTitle>

      {/* 🔹 Content */}
      <DialogContent sx={{ py: 3, px: 4 }}>
        {/* Section 1: ข้อมูลส่วนตัว */}
        <div className="mb-5">
          <h3 className="flex items-center text-[#3674B5] font-semibold mb-2">
            <span className="w-1 h-4 rounded-full bg-[#3674B5] inline-block mr-2"></span>
            ข้อมูลส่วนตัว
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            <p>
              <strong>เลขบัตรประชาชน :</strong> {employee.idCard || "-"}
            </p>
            <p>
              <strong>วันเกิด :</strong> {formatDate(employee.birthDate)}
            </p>
            <p>
              <strong>เพศ :</strong> {employee.gender || "-"}
            </p>
          </div>
        </div>

        <Divider />

        {/* Section 2: การติดต่อ */}
        <div className="mt-5 mb-5">
          <h3 className="flex items-center text-[#3674B5] font-semibold mb-2">
            <span className="w-1 h-4 rounded-full bg-[#3674B5] inline-block mr-2"></span>
            การติดต่อ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
            <p>
              <strong>อีเมล :</strong> {employee.email || "-"}
            </p>
            <p>
              <strong>เบอร์โทร :</strong> {employee.phone || "-"}
            </p>
            <p className="col-span-2">
              <strong>ผู้ติดต่อฉุกเฉิน :</strong>{" "}
              {employee.emergencyContact || "-"}
            </p>
            <p className="col-span-2">
              <strong>ที่อยู่ :</strong> {employee.address || "-"}
            </p>
          </div>
        </div>

        <Divider />

        {/* Section 3: บัญชีผู้ใช้ */}
        <div className="mt-5 mb-5">
          <h3 className="flex items-center text-[#3674B5] font-semibold mb-2">
            <span className="w-1 h-4 rounded-full bg-[#3674B5] inline-block mr-2"></span>
            บัญชีผู้ใช้
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            <p>
              <strong>ชื่อผู้ใช้ :</strong> {employee.username || "-"}
            </p>
            <p>
              <strong>สถานะ :</strong> {employee.status || "-"}
            </p>
          </div>
        </div>

        <Divider />

        {/* Section 4: การทำงาน */}
        <div className="mt-5 mb-5">
          <h3 className="flex items-center text-[#3674B5] font-semibold mb-2">
            <span className="w-1 h-4 rounded-full bg-[#3674B5] inline-block mr-2"></span>
            ข้อมูลการทำงาน
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
            <p>
              <strong>วันที่เริ่มงาน :</strong> {formatDate(employee.hireDate)}
            </p>
            <p>
              <strong>เงินเดือน :</strong>{" "}
              {employee.salary ? employee.salary.toLocaleString() + " บาท" : "-"}
            </p>
          </div>
        </div>

        <Divider />

        {/* Section 5: ร้านที่สังกัด */}
        <div className="mt-5 mb-5">
          <h3 className="flex items-center text-[#3674B5] font-semibold mb-2">
            <span className="w-1 h-4 rounded-full bg-[#3674B5] inline-block mr-2"></span>
            ร้านที่สังกัด
          </h3>
          {employee.storeIds && employee.storeIds.length > 0 ? (
            <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
              {employee.storeIds.map((store, idx) => (
                <li key={idx}>
                  {/* <Storefront size={15} className="inline mr-2 text-[#3674B5]" /> */}
                  {store.storeName || `ร้านหมายเลข ${idx + 1}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">ยังไม่มีร้านที่สังกัด</p>
          )}
        </div>

        <Divider />

        {/* Section 6: อื่น ๆ */}
        <div className="mt-5">
          <h3 className="flex items-center text-[#3674B5] font-semibold mb-2">
            <span className="w-1 h-4 rounded-full bg-[#3674B5] inline-block mr-2"></span>
            ข้อมูลอื่น ๆ
          </h3>
          <div className="text-sm text-slate-700 space-y-1">
            <p>
              {/* <Clock size={15} className="inline mr-2 text-[#3674B5]" /> */}
              <strong>สร้างเมื่อ:</strong> {formatDate(employee.createdAt)}
            </p>
            <p>
              {/* <Clock size={15} className="inline mr-2 text-[#3674B5]" /> */}
              <strong>อัปเดตล่าสุด:</strong> {formatDate(employee.updatedAt)}
            </p>
            <p>
              <strong>หมายเหตุ:</strong> {employee.note || "ไม่มีข้อมูลเพิ่มเติม"}
            </p>
          </div>
        </div>
      </DialogContent>

      {/* 🔹 Footer */}
      <DialogActions
        sx={{
          p: 2,
          justifyContent: "center",
          backgroundColor: "#F5F8FC",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#3674B5",
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            "&:hover": {
              backgroundColor: "#2f5fa0",
            },
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
}
