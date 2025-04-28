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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/problems" element={<Layout><ProblemsPage /></Layout>} />
      <Route path="/problems/:problemId" element={<Layout><ProblemPage /></Layout>} />
      <Route path="/volunteering" element={<Layout><VolunteeringPage /></Layout>} />
      <Route path="/volunteering/contributions" element={<Layout><ContributionsPage /></Layout>} />
      <Route path="/volunteering/contributions/:problemId" element={<Layout><ProblemPage contribution={true} /></Layout>} />
      <Route path="/volunteering/donations" element={<Layout><DonationsPage /></Layout>} />
      <Route path="/volunteering/donations/:problemId" element={<Layout><ProblemPage donation={true}  /></Layout>} />
      <Route path="/statistics" element={<Layout><StatisticsPage  /></Layout>} />

      <Route path="/problems/auctions" element={<Layout><AuctionsPage /></Layout>} />
      <Route path="/problems/completed" element={<Layout><ProblemsPage /></Layout>} />

      <Route path="/manage/problems" element={<Layout><ProblemsTable /></Layout>} />
      <Route path="/manage/users" element={<Layout><UsersTable /></Layout>} />
      <Route path="/manage/govs" element={<Layout><GovsTable /></Layout>} />
      <Route path="/manage/new-account" element={<Layout><NewAccount /></Layout>} />

      <Route path="/user-profile" element={<Layout><UserProfilePage /></Layout>} />
      <Route path="/gov-profile" element={<Layout><GovProfilePage /></Layout>} /> 



      <Route path="/user-activities" element={<Layout><UserActivitiesPage /></Layout>} />
      <Route path="/user-activities/aucations" element={<Layout><MyAucationsPage /></Layout>} />


      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default AppRoutes;