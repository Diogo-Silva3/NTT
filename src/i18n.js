
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "appTitle": "Equipment Checklist NTT DATA",
      "appDescription": "This system helps in managing and checking company equipment, ensuring everything is in order.",
      "searchPlaceholder": "Search equipment by name, type, or location...",
      "add": "Add New",
      "report": "Generate Report",
      "total": "Total",
      "checked": "Checked",
      "functioning": "Functioning",
      "maintenance": "Maintenance",
      "broken": "Defect",
      "allStatuses": "All Statuses",
      "allTypes": "All Types",
      "allLocations": "All Locations",
      "noEquipmentFound": "No Equipment Found",
      "adjustFilters": "Try adjusting your search or filter criteria.",
      "addFirstEquipment": "How about adding your first piece of equipment?",
      "addEquipmentButton": "Add Equipment",
      "equipmentDetails": "Equipment Details",
      "equipmentName": "Equipment Name",
      "equipmentType": "Type",
      "equipmentLocation": "Location",
      "equipmentStatus": "Status",
      "equipmentNotes": "Notes",
      "lastChecked": "Last Checked",
      "photo": "Photo",
      "takePhoto": "Take Photo",
      "viewPhoto": "View Photo",
      "markAsChecked": "Mark as Checked",
      "markAsUnchecked": "Mark as Unchecked",
      "delete": "Delete",
      "addEquipmentTitle": "Add New Equipment",
      "nameLabel": "Name",
      "typeLabel": "Type (e.g., TV, Switch, Camera)",
      "locationLabel": "Location",
      "statusLabel": "Status",
      "notesLabel": "Notes (optional)",
      "saveButton": "Save",
      "cancelButton": "Cancel",
      "capturePhotoTitle": "Capture Photo",
      "startCamera": "Start Camera",
      "captureButton": "Capture",
      "retakeButton": "Retake",
      "usePhotoButton": "Use Photo",
      "photoPreviewTitle": "Photo Preview",
      "closeButton": "Close",
      "reportModalTitle": "Generate Equipment Report",
      "filterByLocation": "Filter by Location:",
      "generatePdfButton": "Generate PDF",
      "equipmentRemoved": "Equipment Removed",
      "equipmentRemovedDesc": "The equipment has been successfully removed.",
      "photoTakenSuccess": "Photo Captured!",
      "photoTakenDesc": "The photo has been successfully captured and linked to the equipment.",
      "error": "Error",
      "fillAllFieldsError": "Please fill in all required fields.",
      "cameraError": "Error accessing camera:",
      "loginTitle": "Access Panel",
      "loginSubtitle": "Log in to manage equipment.",
      "emailLabel": "Email",
      "emailPlaceholder": "your.email@example.com",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Your password",
      "loginButton": "Login",
      "loggingInButton": "Logging in...",
      "logout": "Logout",
      "loginSuccessTitle": "Login Successful!",
      "loginSuccessDesc": "Welcome back, {{name}}!",
      "loginErrorTitle": "Login Error",
      "invalidCredentialsError": "Invalid email or password. Please try again.",
      "loginHint": "Use admin@example.com / admin123 or tech@example.com / tech123 for testing.",
      "loginHintFirebase": "Use credentials registered in Firebase.",
      "portugueseBR": "Português (BR)",
      "english": "English",
      "spanish": "Español",
      "logoPlaceholder": "NTT DATA",
      "adminDashboardTitle": "Administrator Panel",
      "adminDashboardSubtitle": "Manage system users and settings.",
      "userManagementTitle": "User Management",
      "userManagementDesc": "Add, edit, or remove system users and their permissions.",
      "manageUsersButton": "Manage Users",
      "viewReportsTitle": "View Reports",
      "viewReportsDesc": "Access detailed reports and system analytics.",
      "viewReportsButton": "View Reports",
      "systemSettingsTitle": "System Settings",
      "systemSettingsDesc": "Configure general application settings.",
      "configureSettingsButton": "Configure Settings",
      "userManagementShort": "Users",
      "adminDashboardShort": "Dashboard",
      "addUserButton": "Add User",
      "addUserTitle": "Add New User",
      "editUserTitle": "Edit User",
      "userNameLabel": "User Name",
      "roleLabel": "Role",
      "statusLabel": "Status",
      "actionsLabel": "Actions",
      "searchUsersPlaceholder": "Search users by name, email, or role...",
      "admin": "Administrator",
      "technician": "Technician",
      "active": "Active",
      "inactive": "Inactive",
      "userAddedTitle": "User Added",
      "userAddedDesc": "The new user has been successfully added.",
      "userUpdatedTitle": "User Updated",
      "userUpdatedDesc": "User information has been successfully updated.",
      "userDeletedTitle": "User Deleted",
      "userDeletedDesc": "The user has been successfully deleted.",
      "userStatusUpdatedTitle": "User Status Updated",
      "userStatusUpdatedDesc": "User status has been successfully updated.",
      "noUsersFound": "No users found matching your criteria.",
      "saveChangesButton": "Save Changes",
      "addUserButtonModal": "Add User",
      "leaveBlankNoChange": "Leave blank for no change",
      "fillAllRequiredFields": "Please fill in all required fields (Name, Email, and Password for new users).",
      "welcomeUser": "Welcome, {{name}}!",

    }
  },
  es: {
    translation: {
      "appTitle": "Checklist de Equipos NTT DATA",
      "appDescription": "Este sistema ayuda a gestionar y verificar los equipos de la empresa, asegurando que todo esté en orden.",
      "searchPlaceholder": "Buscar equipo por nombre, tipo o ubicación...",
      "add": "Añadir Nuevo",
      "report": "Generar Informe",
      "total": "Total",
      "checked": "Verificado",
      "functioning": "Funcionando",
      "maintenance": "Mantenimiento",
      "broken": "Defectuoso",
      "allStatuses": "Todos los Estados",
      "allTypes": "Todos los Tipos",
      "allLocations": "Todas las Ubicaciones",
      "noEquipmentFound": "No se Encontraron Equipos",
      "adjustFilters": "Intenta ajustar tus criterios de búsqueda o filtro.",
      "addFirstEquipment": "¿Qué tal añadir tu primer equipo?",
      "addEquipmentButton": "Añadir Equipo",
      "equipmentDetails": "Detalles del Equipo",
      "equipmentName": "Nombre del Equipo",
      "equipmentType": "Tipo",
      "equipmentLocation": "Ubicación",
      "equipmentStatus": "Estado",
      "equipmentNotes": "Notas",
      "lastChecked": "Última Verificación",
      "photo": "Foto",
      "takePhoto": "Tomar Foto",
      "viewPhoto": "Ver Foto",
      "markAsChecked": "Marcar como Verificado",
      "markAsUnchecked": "Marcar como No Verificado",
      "delete": "Eliminar",
      "addEquipmentTitle": "Añadir Nuevo Equipo",
      "nameLabel": "Nombre",
      "typeLabel": "Tipo (ej. TV, Switch, Cámara)",
      "locationLabel": "Ubicación",
      "statusLabel": "Estado",
      "notesLabel": "Notas (opcional)",
      "saveButton": "Guardar",
      "cancelButton": "Cancelar",
      "capturePhotoTitle": "Capturar Foto",
      "startCamera": "Iniciar Cámara",
      "captureButton": "Capturar",
      "retakeButton": "Tomar de Nuevo",
      "usePhotoButton": "Usar Foto",
      "photoPreviewTitle": "Vista Previa de Foto",
      "closeButton": "Cerrar",
      "reportModalTitle": "Generar Informe de Equipos",
      "filterByLocation": "Filtrar por Ubicación:",
      "generatePdfButton": "Generar PDF",
      "equipmentRemoved": "Equipo Eliminado",
      "equipmentRemovedDesc": "El equipo ha sido eliminado exitosamente.",
      "photoTakenSuccess": "¡Foto Capturada!",
      "photoTakenDesc": "La foto ha sido capturada y vinculada al equipo exitosamente.",
      "error": "Error",
      "fillAllFieldsError": "Por favor, completa todos los campos obligatorios.",
      "cameraError": "Error al acceder a la cámara:",
      "loginTitle": "Panel de Acceso",
      "loginSubtitle": "Inicia sesión para gestionar equipos.",
      "emailLabel": "Correo Electrónico",
      "emailPlaceholder": "tu.email@ejemplo.com",
      "passwordLabel": "Contraseña",
      "passwordPlaceholder": "Tu contraseña",
      "loginButton": "Iniciar Sesión",
      "loggingInButton": "Iniciando sesión...",
      "logout": "Cerrar Sesión",
      "loginSuccessTitle": "¡Inicio de Sesión Exitoso!",
      "loginSuccessDesc": "¡Bienvenido de nuevo, {{name}}!",
      "loginErrorTitle": "Error de Inicio de Sesión",
      "invalidCredentialsError": "Correo electrónico o contraseña no válidos. Por favor, inténtalo de nuevo.",
      "loginHint": "Usa admin@example.com / admin123 o tech@example.com / tech123 para probar.",
      "loginHintFirebase": "Usa credenciales registradas en Firebase.",
      "portugueseBR": "Portugués (BR)",
      "english": "Inglés",
      "spanish": "Español",
      "logoPlaceholder": "NTT DATA",
      "adminDashboardTitle": "Panel de Administrador",
      "adminDashboardSubtitle": "Gestionar usuarios y configuraciones del sistema.",
      "userManagementTitle": "Gestión de Usuarios",
      "userManagementDesc": "Añadir, editar o eliminar usuarios del sistema y sus permisos.",
      "manageUsersButton": "Gestionar Usuarios",
      "viewReportsTitle": "Ver Informes",
      "viewReportsDesc": "Acceder a informes detallados y análisis del sistema.",
      "viewReportsButton": "Ver Informes",
      "systemSettingsTitle": "Configuración del Sistema",
      "systemSettingsDesc": "Configurar ajustes generales de la aplicación.",
      "configureSettingsButton": "Configurar Ajustes",
      "userManagementShort": "Usuarios",
      "adminDashboardShort": "Panel",
      "addUserButton": "Añadir Usuario",
      "addUserTitle": "Añadir Nuevo Usuario",
      "editUserTitle": "Editar Usuario",
      "userNameLabel": "Nombre de Usuario",
      "roleLabel": "Rol",
      "statusLabel": "Estado",
      "actionsLabel": "Acciones",
      "searchUsersPlaceholder": "Buscar usuarios por nombre, email o rol...",
      "admin": "Administrador",
      "technician": "Técnico",
      "active": "Activo",
      "inactive": "Inactivo",
      "userAddedTitle": "Usuario Añadido",
      "userAddedDesc": "El nuevo usuario ha sido añadido exitosamente.",
      "userUpdatedTitle": "Usuario Actualizado",
      "userUpdatedDesc": "La información del usuario ha sido actualizada exitosamente.",
      "userDeletedTitle": "Usuario Eliminado",
      "userDeletedDesc": "El usuario ha sido eliminado exitosamente.",
      "userStatusUpdatedTitle": "Estado de Usuario Actualizado",
      "userStatusUpdatedDesc": "El estado del usuario ha sido actualizado exitosamente.",
      "noUsersFound": "No se encontraron usuarios que coincidan con tus criterios.",
      "saveChangesButton": "Guardar Cambios",
      "addUserButtonModal": "Añadir Usuario",
      "leaveBlankNoChange": "Dejar en blanco para no cambiar",
      "fillAllRequiredFields": "Por favor, complete todos los campos obligatorios (Nombre, Email y Contraseña para nuevos usuarios).",
      "welcomeUser": "¡Bienvenido, {{name}}!",
    }
  },
  ptBR: {
    translation: {
      "appTitle": "Checklist de Equipamentos NTT DATA",
      "appDescription": "Este sistema auxilia no gerenciamento e checagem dos equipamentos da empresa, garantindo que tudo esteja em ordem.",
      "searchPlaceholder": "Buscar equipamento por nome, tipo ou local...",
      "add": "Adicionar Novo",
      "report": "Gerar Relatório",
      "total": "Total",
      "checked": "Checado",
      "functioning": "Funcionando",
      "maintenance": "Manutenção",
      "broken": "Defeito",
      "allStatuses": "Todos os Status",
      "allTypes": "Todos os Tipos",
      "allLocations": "Todos os Locais",
      "noEquipmentFound": "Nenhum Equipamento Encontrado",
      "adjustFilters": "Tente ajustar seus critérios de busca ou filtro.",
      "addFirstEquipment": "Que tal adicionar seu primeiro equipamento?",
      "addEquipmentButton": "Adicionar Equipamento",
      "equipmentDetails": "Detalhes do Equipamento",
      "equipmentName": "Nome do Equipamento",
      "equipmentType": "Tipo",
      "equipmentLocation": "Local",
      "equipmentStatus": "Status",
      "equipmentNotes": "Notas",
      "lastChecked": "Última Checagem",
      "photo": "Foto",
      "takePhoto": "Tirar Foto",
      "viewPhoto": "Ver Foto",
      "markAsChecked": "Marcar como Checado",
      "markAsUnchecked": "Marcar como Não Checado",
      "delete": "Excluir",
      "addEquipmentTitle": "Adicionar Novo Equipamento",
      "nameLabel": "Nome",
      "typeLabel": "Tipo (ex: TV, Switch, Câmera)",
      "locationLabel": "Local",
      "statusLabel": "Status",
      "notesLabel": "Notas (opcional)",
      "saveButton": "Salvar",
      "cancelButton": "Cancelar",
      "capturePhotoTitle": "Capturar Foto",
      "startCamera": "Iniciar Câmera",
      "captureButton": "Capturar",
      "retakeButton": "Tirar Novamente",
      "usePhotoButton": "Usar Foto",
      "photoPreviewTitle": "Prévia da Foto",
      "closeButton": "Fechar",
      "reportModalTitle": "Gerar Relatório de Equipamentos",
      "filterByLocation": "Filtrar por Local:",
      "generatePdfButton": "Gerar PDF",
      "equipmentRemoved": "Equipamento Removido",
      "equipmentRemovedDesc": "O equipamento foi removido com sucesso.",
      "photoTakenSuccess": "Foto Capturada!",
      "photoTakenDesc": "A foto foi capturada e vinculada ao equipamento com sucesso.",
      "error": "Erro",
      "fillAllFieldsError": "Por favor, preencha todos os campos obrigatórios.",
      "cameraError": "Erro ao acessar a câmera:",
      "loginTitle": "Acessar Painel",
      "loginSubtitle": "Faça login para gerenciar os equipamentos.",
      "emailLabel": "E-mail",
      "emailPlaceholder": "seu.email@exemplo.com",
      "passwordLabel": "Senha",
      "passwordPlaceholder": "Sua senha",
      "loginButton": "Entrar",
      "loggingInButton": "Entrando...",
      "logout": "Sair",
      "loginSuccessTitle": "Login Bem-sucedido!",
      "loginSuccessDesc": "Bem-vindo de volta, {{name}}!",
      "loginErrorTitle": "Erro no Login",
      "invalidCredentialsError": "E-mail ou senha inválidos. Por favor, tente novamente.",
      "loginHint": "Use admin@example.com / admin123 ou tech@example.com / tech123 para testar.",
      "loginHintFirebase": "Use credenciais registradas no Firebase.",
      "portugueseBR": "Português (BR)",
      "english": "Inglês",
      "spanish": "Espanhol",
      "logoPlaceholder": "NTT DATA",
      "adminDashboardTitle": "Painel do Administrador",
      "adminDashboardSubtitle": "Gerencie usuários e configurações do sistema.",
      "userManagementTitle": "Gerenciamento de Usuários",
      "userManagementDesc": "Adicione, edite ou remova usuários do sistema e suas permissões.",
      "manageUsersButton": "Gerenciar Usuários",
      "viewReportsTitle": "Visualizar Relatórios",
      "viewReportsDesc": "Acesse relatórios detalhados e análises do sistema.",
      "viewReportsButton": "Ver Relatórios",
      "systemSettingsTitle": "Configurações do Sistema",
      "systemSettingsDesc": "Configure as definições gerais da aplicação.",
      "configureSettingsButton": "Configurar Definições",
      "userManagementShort": "Usuários",
      "adminDashboardShort": "Painel",
      "addUserButton": "Adicionar Usuário",
      "addUserTitle": "Adicionar Novo Usuário",
      "editUserTitle": "Editar Usuário",
      "userNameLabel": "Nome do Usuário",
      "roleLabel": "Função",
      "statusLabel": "Status",
      "actionsLabel": "Ações",
      "searchUsersPlaceholder": "Buscar usuários por nome, email ou função...",
      "admin": "Administrador",
      "technician": "Técnico",
      "active": "Ativo",
      "inactive": "Inativo",
      "userAddedTitle": "Usuário Adicionado",
      "userAddedDesc": "O novo usuário foi adicionado com sucesso.",
      "userUpdatedTitle": "Usuário Atualizado",
      "userUpdatedDesc": "As informações do usuário foram atualizadas com sucesso.",
      "userDeletedTitle": "Usuário Excluído",
      "userDeletedDesc": "O usuário foi excluído com sucesso.",
      "userStatusUpdatedTitle": "Status do Usuário Atualizado",
      "userStatusUpdatedDesc": "O status do usuário foi atualizado com sucesso.",
      "noUsersFound": "Nenhum usuário encontrado com os seus critérios.",
      "saveChangesButton": "Salvar Alterações",
      "addUserButtonModal": "Adicionar Usuário",
      "leaveBlankNoChange": "Deixe em branco para não alterar",
      "fillAllRequiredFields": "Por favor, preencha todos os campos obrigatórios (Nome, Email e Senha para novos usuários).",
      "welcomeUser": "Bem-vindo(a), {{name}}!",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ptBR', // fallback language
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
