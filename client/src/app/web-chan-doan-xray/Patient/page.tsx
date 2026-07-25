'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Transition } from "@/components/modal/form-modal";
import { useSearch } from "@/hooks/use-search";
import { useRefresh } from "@/hooks/use-refresh";

// Import Phosphor Icons
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Calendar as CalendarIcon } from '@phosphor-icons/react/dist/ssr/Calendar';
import { FilePlus as FileTextIcon } from '@phosphor-icons/react/dist/ssr/FilePlus';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

// Định nghĩa kiểu dữ liệu
interface BenhNhan {
  id: number;
  maYTe: string | null;
  tenBenhNhan: string;
  gioiTinh: string;
  ngayTao: string;
  ngaySinh: string;
}
interface LinkFiles {
  chanDoan: string;
  duongDanChanDoan: string;
}
interface Patient {
  BenhNhanId: number;
  TrangThai: boolean;
  benhNhan: BenhNhan;
  id: number | string;
  linkFiles: LinkFiles | null;
}

const getAge = (dob: string) => {
  const birthDate = new Date(dob); // Chuyển đổi chuỗi ngày sinh thành đối tượng Date
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
  const birthYear = birthDate.getFullYear(); // Lấy năm sinh
  return currentYear - birthYear; // Tính tuổi
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Chuyển đổi ngày thành định dạng ngày tháng năm mặc định
};

// Cấu hình API
const API_URL = process.env.NEXT_PUBLIC_QLDT_BASE_URL || 'http://localhost:5292';

// Dịch vụ API
const apiService = {
  // Lấy danh sách bệnh nhân (chỉ thông tin cơ bản, không có AnhGoc và chanDoan)
  getPatients: async () => {
    try {
      console.log('Fetching patients from API...', `${API_URL}/api/TiepNhan`);
      const response = await axios.get(`${API_URL}/api/TiepNhan`);
      console.log('Patients:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Lấy chi tiết bệnh nhân (bao gồm AnhGoc và chanDoan)
  getPatientDetails: async (patientId: string) => {
    try {
      console.log('Fetching patient details...', `${API_URL}/api/TiepNhan/${patientId}`);
      const response = await axios.get(`${API_URL}/api/TiepNhan/${patientId}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw error;
    }
  },

  // Tải lên ảnh X-quang
  uploadXrayImage: async (tiepNhanId: string, file: File) => {
    try {
      const formData = new FormData();
      
      // Tên phải đúng theo kiểu mảng: linkFiles[0].File, linkFiles[0].Loai
      formData.append('linkFiles[0].File', file);
      formData.append('linkFiles[0].Loai', 'Xray');
  
      console.log('Uploading X-ray image...', `${API_URL}/upload/${tiepNhanId}`);
      console.log('FormData:', formData.get('linkFiles[0].File'));
      const response = await axios.post(`${API_URL}/upload/${tiepNhanId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading X-ray image:', error);
      throw error;
    }
  },
  
  // Phân tích ảnh X-quang bằng AI
  analyzeXrayImage: async (tiepNhanId: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/TiepNhan/chanDoanPreview/${tiepNhanId}`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing X-ray image:', error);
      throw error;
    }
  },

  // Lưu kết quả chẩn đoán
saveDiagnosis: async (tiepNhanId: string, diagnosisData: any) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/TiepNhan/saveChanDoan/${tiepNhanId}`,
        diagnosisData
      );
      return response.data;
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      throw error;
    }
  }
};

export default function MedicalDiagnosisApp() {
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientDetailsLoaded, setPatientDetailsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
   const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisSaved, setAnalysisSaved] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoadingPatientDetails, setIsLoadingPatientDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning'
  });

  const { refresh, setRefresh } = useRefresh();

  // Fetch dữ liệu bệnh nhân khi component mount
  useEffect(() => {
    const fetchPatients = async () => {
      setIsDataLoading(true);
      try {
        // Gọi API để lấy danh sách bệnh nhân (không bao gồm AnhGoc và chanDoan)
        const data = await apiService.getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải dữ liệu bệnh nhân. Vui lòng thử lại sau.',
          severity: 'error'
        });
        // Khởi tạo mảng rỗng nếu API lỗi
        setPatients([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchPatients();
  }, [refresh]);

  // Xử lý thay đổi tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSelectedPatient(null);
    setPatientDetailsLoaded(false);
    setShowDiagnosisModal(false);
  };

  // Lọc bệnh nhân theo tab và tìm kiếm
  const filteredPatients = patients.filter(patient => {
    const matchesTab = activeTab === 0 ? !patient.TrangThai : patient.TrangThai;
        const matchesSearch =
      patient.benhNhan.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(patient.id).toLowerCase().includes(searchTerm.toLowerCase());
    const createdDate = new Date(patient.benhNhan.ngayTao);
    const from = fromDate ? new Date(fromDate) : null;
    if (from) from.setHours(0, 0, 0, 0);
    const to = toDate ? new Date(toDate) : null;
    if (to) to.setHours(23, 59, 59, 999);
    const matchesFrom = !from || createdDate >= from;
    const matchesTo = !to || createdDate <= to;
    return matchesTab && (searchTerm === '' || matchesSearch) && matchesFrom && matchesTo;
  });

  // Xử lý chọn bệnh nhân - bây giờ sẽ tải chi tiết khi cần
  const handleSelectPatient = async (patient: Patient) => {
    // Đặt thông tin cơ bản trước
    setSelectedPatient(patient);
    setPatientDetailsLoaded(false);
    
    // Sau đó tải thông tin chi tiết (AnhGoc, chanDoan)
    setIsLoadingPatientDetails(true);
    try {
      // Lấy thêm chi tiết bệnh nhân từ API
      const patientDetails = await apiService.getPatientDetails(patient.id.toString());
      setSelectedPatient(patientDetails);
      setPatientDetailsLoaded(true);
      console.log('Patient details:', patientDetails);
      console.log('Patient details loaded:', selectedPatient?.linkFiles?.[0]?.chanDoan);
      // Nếu bệnh nhân chưa được chẩn đoán, mở modal chẩn đoán
      if (!patient.TrangThai) {
        setShowDiagnosisModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải chi tiết bệnh nhân. Hiển thị thông tin cơ bản.',
        severity: 'warning'
      });
    } finally {
      setIsLoadingPatientDetails(false);
    }
  };

  // Xử lý upload ảnh
  const handleImageUpload = () => {
    // Tạo input file ẩn để chọn file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        setUploadedImageFile(file);
        
        // Tạo URL để preview ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImage(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    fileInput.click();
  };

  // Xử lý phân tích ảnh
  const handleAnalyzeImage = async () => {
    if (!uploadedImageFile || !selectedPatient) return;
  
    setIsLoading(true);
    try {
      // ✅ Upload ảnh trước
      const formData = new FormData();
      formData.append('linkFiles[0].File', uploadedImageFile); // gửi đúng dạng mảng DTO
      formData.append('linkFiles[0].Loai', 'Xray'); // hoặc 'Ảnh X-quang'
  
      const uploadUrl = `${API_URL}/api/TiepNhan/${selectedPatient.id}`;
      const uploadResponse = await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload response:', uploadUrl, uploadResponse.data);
      const uploaded = uploadResponse.data[0]; // Vì backend trả về mảng LinkFileDTO[]
      const imageUrl = uploaded.duongDanGoc || uploaded.imageUrl;
  
      // ✅ Gọi API phân tích ảnh (nếu có)
      const analysisResult = await apiService.analyzeXrayImage(
        selectedPatient.id.toString()
      );
      console.log('Analysis result:', analysisResult);
      setDiagnosisResult({
        predictionText: analysisResult.prediction_text || analysisResult.predictionText,
        diagnosticImagePath:
          analysisResult.diagnostic_image_path || analysisResult.diagnosticImagePath,
        xrayImageUrl: imageUrl,

        });
    } catch (error) {
      console.error('Failed to analyze X-ray image:', error);
  
      setSnackbar({
        open: true,
        message: 'Không thể phân tích ảnh. Vui lòng thử lại sau.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveDiagnosis = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    try {
      await apiService.saveDiagnosis(selectedPatient.id.toString(), {
        id: selectedPatient.id.toString(),
        image_path: diagnosisResult.xrayImageUrl,
        prediction_text: diagnosisResult.predictionText,
        diagnostic_image_path: diagnosisResult.diagnosticImagePath,
      });
      setAnalysisSaved(true);
      setSnackbar({ open: true, message: 'Lưu kết quả thành công', severity: 'success' });
    } catch (error) {
      console.error('Failed to save diagnosis:', error);
      setSnackbar({ open: true, message: 'Lưu kết quả thất bại', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Đóng modal chẩn đoán
  const closeModal = () => {
    setShowDiagnosisModal(false);
    setUploadedImage(null);
    setUploadedImageFile(null);
    setDiagnosisResult(null);
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">Hệ thống Quản lý Chẩn đoán X-quang</Typography>
        </Box>
        
        {/* Tab Navigation */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Bệnh nhân chưa chẩn đoán" />
          <Tab label="Bệnh nhân đã chẩn đoán" />
        </Tabs>
        
        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: '100%', sm: 200 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="date"
              label="Từ ngày"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ width: { xs: '100%', sm: 220 } }}
            />
            <TextField
              type="date"
              label="Đến ngày"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sx={{ width: { xs: '100%', sm: 220 } }}
            />
          </Stack>
        </Box>
        
        {/* Main Content Area */}
        <Box sx={{ display: 'flex', height: 600 }}>
          {/* Patient List */}
          <Box sx={{ width: '33%', borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {activeTab === 0 ? 'Danh sách bệnh nhân chưa chẩn đoán' : 'Danh sách bệnh nhân đã chẩn đoán'}
              </Typography>
            </Box>
            
            {isDataLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
              </Box>
            ) : filteredPatients.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography>Không tìm thấy bệnh nhân</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {filteredPatients.map(patient => (
                                    <ListItem key={patient.id.toString()} disablePadding divider>
                    <ListItemButton
                      selected={selectedPatient?.id === patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      sx={{
                        '&.Mui-selected': { bgcolor: 'primary.lighter' },
                        '&:hover': { bgcolor: 'primary.lighter' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                          {patient.benhNhan.tenBenhNhan.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography fontWeight="medium">{patient.benhNhan.tenBenhNhan}</Typography>}
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">Mã BN: {patient.benhNhan.maYTe}</Typography>
                            <Typography variant="body2" color="text.secondary">{patient.benhNhan.gioiTinh}</Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          
          {/* Patient Details */}
          <Box sx={{ width: '67%', p: 3 }}>
            {selectedPatient ? (
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>Thông tin bệnh nhân</Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <UserIcon size={20} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Họ và tên</Typography>
                        <Typography fontWeight="medium">{selectedPatient.benhNhan.tenBenhNhan}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Mã bệnh nhân</Typography>
                      <Typography fontWeight="medium">{selectedPatient.benhNhan.maYTe}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Tuổi</Typography>
                      <Typography fontWeight="medium">
                        {selectedPatient?.benhNhan?.ngaySinh ? getAge(selectedPatient.benhNhan.ngaySinh) : "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Giới tính</Typography>
                      <Typography fontWeight="medium">{selectedPatient.benhNhan.gioiTinh}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarIcon size={20} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Ngày tiếp nhận</Typography>
                        <Typography fontWeight="medium">
                          {selectedPatient?.benhNhan?.ngayTao ? formatDate(selectedPatient.benhNhan.ngayTao) : "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
                
                {isLoadingPatientDetails ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, p: 4 }}>
                    <CircularProgress size={40} />
                    <Typography sx={{ ml: 2 }}>Đang tải thông tin chi tiết...</Typography>
                  </Box>
                ) : patientDetailsLoaded && selectedPatient?.linkFiles?.[0]?.chanDoan? (
                  <Box mt={4}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <FileTextIcon size={20} />
                      <Typography variant="h6" fontWeight="medium">Kết quả chẩn đoán</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                       <img
                          src={`${API_URL}/uploads/${selectedPatient.linkFiles?.[0]?.duongDanChanDoan}`}
                          alt="X-ray"
                          style={{ width: 250, height: 250, objectFit: 'cover' }}
                        />
                      </Box>
                      <Box flexGrow={1}>
                        <Card sx={{ p: 2, bgcolor: 'success.lighter', border: 1, borderColor: 'success.light' }}>
                          <Typography fontWeight="medium" color="success.dark" mb={1}>Kết quả chẩn đoán</Typography>
                          <Typography>{selectedPatient?.linkFiles?.[0]?.chanDoan}</Typography>
                        </Card>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box mt={4} sx={{ textAlign: 'center', p: 3, bgcolor: 'grey.100', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                    <Typography color="text.secondary" mb={2}>Bệnh nhân chưa có kết quả chẩn đoán</Typography>
                    <Button
                      variant="contained"
                      startIcon={<PlusIcon weight="bold" />}
                      onClick={() => setShowDiagnosisModal(true)}
                    >
                      Thêm chẩn đoán mới
                    </Button>
                  </Box>
                )}
               </Card>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Chọn một bệnh nhân để xem chi tiết</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Dialog Chẩn đoán */}
      <Dialog
        open={showDiagnosisModal}
        onClose={closeModal}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chẩn đoán mới - {selectedPatient?.benhNhan.tenBenhNhan}</Typography>
          <IconButton onClick={closeModal} size="small">
            <XIcon size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            <Box mb={4}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>1. Tải lên ảnh X-quang</Typography>
              {!uploadedImage ? (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                  onClick={handleImageUpload}
                >
                  <UploadIcon size={32} style={{ margin: '0 auto 8px' }} />
                  <Typography color="text.secondary">Click để tải lên ảnh X-quang</Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={uploadedImage}
                    alt="X-ray Preview"
                    style={{ maxHeight: 250, margin: '0 auto 8px' }}
                  />
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      color="error"
                      size="small"
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedImageFile(null);
                      }}
                    >
                      Xóa
                    </Button>
                    <Button
                      color="primary"
                      size="small"
                      onClick={handleImageUpload}
                    >
                      Tải ảnh khác
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
            
            {uploadedImage && !diagnosisResult && (
              <Box mb={4}>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>2. Phân tích ảnh X-quang</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  onClick={handleAnalyzeImage}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                      Đang phân tích...
                    </>
                  ) : 'Phân tích bằng AI'}
                </Button>
              </Box>
            )}
            
            {diagnosisResult && (
              <Box mb={4}>
                     <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  2. Kết quả phân tích
                </Typography>
                <Card
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: 'success.lighter',
                    border: 1,
                    borderColor: 'success.light',
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={diagnosisResult.predictionText}
                    onChange={(e) =>
                      setDiagnosisResult({
                        ...diagnosisResult,
                        predictionText: e.target.value,
                      })
                    }
                  />
                </Card>
                {diagnosisResult.diagnosticImagePath && (
                  <Box mb={2} textAlign="center">
                    <img
                      src={`${API_URL}/uploads/${diagnosisResult.diagnosticImagePath}`}
                      alt="Ảnh chẩn đoán"
                      style={{ maxHeight: 250 }}
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={isLoading || isSaving}
                  onClick={analysisSaved ? () => window.location.reload() : handleSaveDiagnosis}
                >
                  {analysisSaved ? (
                    isSaving ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                        Đang đóng...
                      </>
                    ) : 'Đóng'
                  ) : (
                    isSaving ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                        Đang lưu...
                      </>
                    ) : 'Lưu'
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Snackbar thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}