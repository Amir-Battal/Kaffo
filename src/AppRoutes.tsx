import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import UserProfilePage from "./pages/UserProfilePage";
import ProblemsPage from "./pages/ProblemsPage";
import GovProfilePage from "./pages/GovProfilePage";
import HomePage from "./pages/HomePage";
import VolunteeringPage from "./pages/VolunteeringPage";
import ProblemPage from "./pages/ProblemPage";
import ContributionsPage from "./pages/ContributionsPage";
import DonationsPage from "./pages/DonationsPage";
import StatisticsPage from "./pages/StatisticsPage";
import { ProblemsTable } from "./pages/ProblemsTable";
import AuctionsPage from "./pages/AuctionsPage";
import UserActivitiesPage from "./pages/UserActivitiesPage";
import MyAucationsPage from "./pages/MyAucationsPage";
import { UsersTable } from "./pages/UsersTable";
import { GovsTable } from "./pages/GovsTable";
import NewAccount from "./pages/NewAccount";
import MyContributionsPage from "./pages/MyContributionsPage";
import MyDonationsPage from "./pages/MyDonationsPage";
import PrivateRoute from "./PrivateRoute";
import keycloak from "./lib/keycloak";
import { AssignGovRole } from "./pages/AssignGovRole";

const AppRoutes = () => {

  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/problems" element={
        <PrivateRoute><Layout><ProblemsPage /></Layout></PrivateRoute>
      } />
      <Route path="/problems/:problemId" element={
        <PrivateRoute><Layout><ProblemPage /></Layout></PrivateRoute>
      } />
      <Route path="/volunteering" element={
        <PrivateRoute><Layout><VolunteeringPage /></Layout></PrivateRoute>
      } />
      <Route path="/volunteering/contributions" element={
        <PrivateRoute><Layout><ContributionsPage /></Layout></PrivateRoute>
      } />
      <Route path="/volunteering/contributions/:problemId" element={
        <PrivateRoute><Layout><ProblemPage contribution={true} /></Layout></PrivateRoute>
      } />
      <Route path="/volunteering/donations" element={
        <PrivateRoute><Layout><DonationsPage /></Layout></PrivateRoute>
      } />
      <Route path="/volunteering/donations/:problemId" element={
        <PrivateRoute><Layout><ProblemPage donation={true} /></Layout></PrivateRoute>
      } />
      <Route path="/statistics" element={
        <PrivateRoute><Layout><StatisticsPage /></Layout></PrivateRoute>
      } />
      <Route path="/problems/auctions" element={
        <PrivateRoute><Layout><AuctionsPage /></Layout></PrivateRoute>
      } />
      <Route path="/problems/completed" element={
        <PrivateRoute><Layout><ProblemsPage /></Layout></PrivateRoute>
      } />
      <Route path="/manage/problems" element={
        <PrivateRoute><Layout><ProblemsTable /></Layout></PrivateRoute>
      } />
      <Route path="/manage/users" element={
        <PrivateRoute><Layout><UsersTable /></Layout></PrivateRoute>
      } />
      <Route path="/manage/govs" element={
        <PrivateRoute><Layout><GovsTable /></Layout></PrivateRoute>
      } />
      <Route path="/manage/new-account" element={
        <PrivateRoute><Layout><NewAccount /></Layout></PrivateRoute>
      } />
      
      {roles.includes("ROLE_GOV") || roles.includes("ROLE_ADMIN")
        ?(
          <Route path="/gov-profile" element={
            <PrivateRoute><Layout><GovProfilePage /></Layout></PrivateRoute>
          } />
        ):(
          <Route path="/user-profile" element={
            <PrivateRoute><Layout><UserProfilePage /></Layout></PrivateRoute>
          } />
        )
      }
      {
        roles.includes("ROLE_ADMIN") && (
          <Route path="/gov-profile/:govId" element={
            <PrivateRoute><Layout><GovProfilePage /></Layout></PrivateRoute>
          } />
        )
      }
      {
        roles.includes("ROLE_ADMIN") && (
          <Route path="/user-profile/:userId" element={
            <PrivateRoute><Layout><UserProfilePage /></Layout></PrivateRoute>
          } />
        )
      }
      {
        roles.includes("ROLE_ADMIN") && (
          <Route path="/assign-role" element={
            <PrivateRoute><Layout><AssignGovRole /></Layout></PrivateRoute>
          } />
        )
      }
      <Route path="/user-activities" element={
        <PrivateRoute><Layout><UserActivitiesPage /></Layout></PrivateRoute>
      } />
      <Route path="/user-activities/aucations" element={
        <PrivateRoute><Layout><MyAucationsPage /></Layout></PrivateRoute>
      } />
      <Route path="/user-activities/contributions" element={
        <PrivateRoute><Layout><MyContributionsPage /></Layout></PrivateRoute>
      } />
      <Route path="/user-activities/donations" element={
        <PrivateRoute><Layout><MyDonationsPage /></Layout></PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
