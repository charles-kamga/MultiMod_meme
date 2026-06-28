/**
 * Service d'authentification Firebase.
 * Gère la connexion (email/mot de passe + Google), l'inscription et la déconnexion.
 * Les messages d'erreur sont localisés en français.
 */

import auth from '@react-native-firebase/auth';
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const authInstance = getAuth();

GoogleSignin.configure({
  webClientId: 'TON_ID_CLIENT_WEB.apps.googleusercontent.com',
});

/**
 * Connecte un utilisateur avec email et mot de passe.
 * Retourne un objet { success, user } ou { success: false, error }.
 */
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

/**
 * Inscrit un nouvel utilisateur avec email, mot de passe et nom d'affichage.
 * Retourne un objet { success, user } ou { success: false, error }.
 */
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

/**
 * Connecte l'utilisateur via Google Sign-In.
 * Vérifie d'abord la disponibilité des Google Play Services,
 * puis échange le token d'ID Google contre une credential Firebase.
 */
export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;

    if (!idToken) {
      throw new Error("Impossible de récupérer le jeton ID Google");
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(authInstance, googleCredential);

    return userCredential;
  } catch (error: any) {
    console.error("Erreur d'authentification Google :", error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur de Firebase Auth.
 */
export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Impossible de se déconnecter.' };
  }
};
