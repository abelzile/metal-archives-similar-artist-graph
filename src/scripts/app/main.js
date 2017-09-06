'use strict';
import '../../styles/styles.css';
import '../../styles/flags.css';
import '!!file-loader?name=[name].[ext]!../../images/blank.gif';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/menu.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/dialog.css';
import 'jquery-ui/ui/widgets/dialog';
import { AppView } from './views/app';

new AppView();
