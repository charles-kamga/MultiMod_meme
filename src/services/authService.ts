import auth from '@react-native-firebase/auth';

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    const code = error.code;
    let message = 'Une erreur est survenue lors de la connexion.';

    if (code === 'auth/user-not-found') {
      message = 'Aucun compte trouvé avec cet email.';
    } else if (code === 'auth/wrong-password') {
      message = 'Mot de passe incorrect.';
    } else if (code === 'auth/invalid-email') {
      message = 'Adresse email invalide.';
    } else if (code === 'auth/invalid-credential') {
      message = 'Email ou mot de passe incorrect.';
    } else if (code === 'auth/too-many-requests') {
      message = 'Trop de tentatives. Réessaye plus tard.';
    } else if (code === 'auth/user-disabled') {
      message = 'Ce compte a été désactivé.';
    }

    return { success: false, error: message };
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    if (userCredential.user) {
      await userCredential.user.updateProfile({ displayName });
    }
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    const code = error.code;
    let message = 'Une erreur est survenue lors de l\'inscription.';

    if (code === 'auth/email-already-in-use') {
      message = 'Cet email est déjà utilisé.';
    } else if (code === 'auth/invalid-email') {
      message = 'Adresse email invalide.';
    } else if (code === 'auth/weak-password') {
      message = 'Le mot de passe doit contenir au moins 6 caractères.';
    } else if (code === 'auth/too-many-requests') {
      message = 'Trop de tentatives. Réessaye plus tard.';
    }

    return { success: false, error: message };
  }
};

export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Impossible de se déconnecter.' };
  }
};
